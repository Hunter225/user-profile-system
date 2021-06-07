const config = require('../config');
const db = require('../models');
const User = db.user;
const { removeSpecialChar } = require('../utils');
const _ = require('lodash');

// patch the status of user
exports.patchUser = async (req, res) => {
  try {
    const userId = _.get(req, 'params.id');
    const status = _.get(req, 'body.status');

    const user = await User.findOneAndUpdate(
      { id: userId },
      { status: status },
      { new: true, projection: '-password' }
    );
    res.status(200).send({ user });
    return;
  } catch (err) {
    res.status(500).send({ message: err.toString() });
    return;
  }
};

// get a page of user
exports.getUsers = async (req, res) => {
  try {
    const filter = {};
    const orArr = [];
    const projection = '-password';
    const options = {};

    const page = parseInt(_.get(req, 'query.page'));
    const limit = parseInt(_.get(req, 'query.limit'));
    const skip = (page - 1) * limit;

    _.set(options, 'limit', limit);
    _.set(options, 'skip', skip);

    let status = _.get(req, 'query.status');
    if (status) {
      status = status.split(',');
      _.set(filter, 'status', { $in: status });
    }

    let userName = _.get(req, 'query.userName');

    if (userName) {
      userName = removeSpecialChar(userName);
      orArr.push({ userName: new RegExp(userName, 'i') });
    }

    let surName = _.get(req, 'query.surName');

    if (surName) {
      surName = removeSpecialChar(surName);
      orArr.push({ surName: new RegExp(surName, 'i') });
    }

    let givenName = _.get(req, 'query.givenName');

    if (givenName) {
      givenName = removeSpecialChar(givenName);
      orArr.push({ givenName: new RegExp(givenName, 'i') });
    }

    if (!_.isEmpty(orArr)) {
      _.set(filter, '$or', orArr);
    }

    const result = await User.find(filter, projection, options);
    const total = await User.count(filter);

    res.status(200).send({ page, limit, result, total });
    return;
  } catch (err) {
    res.status(500).send({ message: err.toString().toString() });
    return;
  }
};
