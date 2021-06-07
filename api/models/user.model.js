const userEnum = require('../constants/userEnum');
const config = require('../config');
const mongoose = require('mongoose');
const GUID = require('mongoose-guid');
const bcrypt = require('bcrypt');

const User = mongoose.Schema({
  id: { type: String, default: GUID.value },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  givenName: { type: String, requred: false },
  surName: { type: String, required: false },
  DOB: { type: Date, required: false },
  role: { type: String, enum: userEnum.ROLE, default: 'USER' },
  status: { type: String, enum: userEnum.STATUS, default: 'PENDING' }
});

User.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(config.saltFactor, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
      }

      // override the cleartext password with the hashed one
      user.password = hash;

      next();
    });
  });
});

module.exports = mongoose.model('User', User);
