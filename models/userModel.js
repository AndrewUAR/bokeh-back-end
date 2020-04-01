const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required!'],
      trim: true,
      maxlength: [20, 'A first name must have less or equal to 20 characters!'],
      minlength: [2, 'A first name must be at least 2 characters!'],
      validate: [validator.isAlpha, "A first name can't contain numbers"]
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required!'],
      trim: true,
      maxlength: [20, 'A last name must have less or equal to 20 characters!'],
      minlength: [2, 'A last name must be at least 2 characters!'],
      validate: [validator.isAlpha, 'A last name can not contain numbers']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address!'],
      unique: [true, 'User with this email already exists!'],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email!']
    },
    profilePhoto: {
      type: String
    },
    favoritePhotographers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    password: {
      type: String,
      required: [true, 'Please provide a password!'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password!'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Password does not match.'
      }
    },
    role: {
      type: String,
      enum: ['user', 'photographer', 'admin'],
      default: 'user'
    },
    photographer: new mongoose.Schema({
      bio: {
        type: String,
        required: [true, 'A bio can not be blank!'],
        trim: true,
        maxLength: [250, 'A bio can not be longer than 250 characters!'],
        minLength: [100, 'A bio can not be shorter than 100 characters!']
      },
      languages: [String],
      locations: {
        type: [[Number]],
        required: [true, 'Photographer must have a location!']
      },
      specialties: {
        type: [String],
        required: [true, 'A bio can not be blank!']
      },
      ratingsQuantity: {
        type: Number,
        default: 0
      },
      ratingsAverage: {
        type: Number,
        default: 5,
        min: [1, 'Rating must be above 0.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10
      },
      hired: {
        type: Number,
        default: 0
      }
    }),
    hideProfile: {
      type: Boolean,
      default: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

userSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'photographer'
});

userSchema.virtual('photoSessions', {
  ref: 'PhotoSession',
  localField: '_id',
  foreignField: 'photographer'
});

userSchema.virtual('albums', {
  ref: 'Album',
  localField: '_id',
  foreignField: 'photographer'
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('/^find/', function(next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  if (obj.role === 'user' || obj.role === 'admin') {
    delete obj.photographer;
  }
  delete obj.hideProfile;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
