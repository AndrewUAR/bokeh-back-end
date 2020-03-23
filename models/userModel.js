const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
  languages: [String],
  locations: [[Number]],
  role: {
    type: String,
    enum: ['user', 'photographer', 'admin'],
    default: 'user'
  },
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  activePhotographer: {
    type: Boolean,
    default: false,
    select: true
  }
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

const User = mongoose.model('User', userSchema);

module.exports = User;
