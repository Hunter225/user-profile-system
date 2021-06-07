const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../models');
const User = db.user;
const _ = require('lodash');

verifyToken = (req, res, next) => {
  // Header can be 'authorization' or 'Authorization'
  let token = _.get(
    req,
    'headers.authorization',
    _.get(req, 'headers.Authorization')
  );
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  const user = await User.findOne({ id: req.userId });

  try {
    if (user.role === 'ADMIN') {
      next();
      return;
    } else {
      res.status(403).send({ message: 'Require Admin Role!' });
      return;
    }
  } catch (err) {
    res.status(500).send({ message: err.toString() });
    return;
  }
};

/*
a normal user (other than admin) can only modify
his/her own profile
*/
isSameId = (req, res, next) => {
  try {
    if (req.params.id === req.userId) {
      next();
      return;
    } else {
      res.status(403).send({ message: 'You can only modify your own profile' });
      return;
    }
  } catch (err) {
    res.status(500).send({ message: err.toString() });
    return;
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isSameId
};
module.exports = authJwt;
