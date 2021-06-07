const config = require('../config');
const db = require('../models');
const User = db.user;
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const transformDOB = (DOB) => {
  const DOBStrArr = DOB.split('-');
  const DOBTransformed = `${DOBStrArr[1]}-${DOBStrArr[0]}-${DOBStrArr[2]}`;
  return DOBTransformed;
};

// Create a user
exports.signUp = async (req, res) => {
  try {
    const userName = _.get(req, 'body.userName');
    const password = _.get(req, 'body.password');
    const givenName = _.get(req, 'body.givenName', undefined);
    const surName = _.get(req, 'body.surName', undefined);
    var DOB = _.get(req, 'body.DOB', undefined);
    if (DOB) {
      DOB = transformDOB(DOB);
    }

    var user = new User({
      userName: userName,
      password: password,
      givenName: givenName,
      surName: surName,
      DOB: DOB,
      role: 'USER'
    });

    user = await user.save();
    _.set(user, 'password', undefined);
    res.status(200).send({ user });
    return;
  } catch (err) {
    res.status(500).send({ message: err.toString() });
    return;
  }
};

// Get Jwt token
exports.signIn = async (req, res) => {
  try {
    const userName = _.get(req, 'body.userName');
    const password = _.get(req, 'body.password');

    var user = await User.findOne({
      userName: userName
    });

    const status = _.get(user, 'status');

    if (!user) {
      return res.status(404).send({ message: 'User Not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({
        message: 'Invalid Password!'
      });
    }

    const token =
      status === 'ACTIVE'
        ? jwt.sign({ id: user.id, role: user.role }, config.secret, {
            expiresIn: 3600 // The expiration time of the token is set to be 1 hour
          })
        : undefined;

    res.status(200).send({
      id: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      status: status,
      token: token
    });
  } catch (err) {
    res.status(500).send({ message: err.toString() });
    return;
  }
};

// Get a User
exports.getUser = async (req, res) => {
  try {
    const userId = _.get(req, 'params.id');

    var filter = { id: userId };

    const user = await User.findOne(filter, '-password');
    res.status(200).send({ user });
    return;
  } catch (err) {
    res.status(500).send({ message: err.toString() });
    return;
  }
};

// Patch the surname, given name and DOB of user
exports.patchUser = async (req, res) => {
  try {
    const userId = _.get(req, 'params.id');
    const surName = _.get(req, 'body.surName');
    const givenName = _.get(req, 'body.givenName');
    const DOB = _.get(req, 'body.DOB');
    var filter = { id: userId };
    var update = {};

    if (surName) _.set(update, 'surName', surName);
    if (givenName) _.set(update, 'givenName', givenName);
    if (DOB) _.set(update, 'DOB', transformDOB(DOB));

    const user = await User.findOneAndUpdate(filter, update, {
      new: true,
      projection: '-password'
    });
    res.status(200).send({ user });
    return;
  } catch (err) {
    res.status(500).send({ message: err.toString() });
    return;
  }
};

// Patch the user status to DELETED
exports.deleteUser = async (req, res) => {
  try {
    const userId = _.get(req, 'params.id');

    var filter = { id: userId };
    var update = { status: 'DELETED' };

    const user = await User.findOneAndUpdate(filter, update, {
      new: true,
      projection: '-password'
    });
    res.status(200).send({ user });
    return;
  } catch (err) {
    res.status(500).send({ message: err.toString() });
    return;
  }
};
