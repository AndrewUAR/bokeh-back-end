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
  profilePhoto: {
    type: String
  },
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
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
