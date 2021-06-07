const db = require('../models');
const User = db.user;
const _ = require('lodash');
const strToDate = require('../utils/strToDate');
/*
The user name should unique, 
longer than or equal to 3 characters,
shorter than or equal to 20 characters and 
contain NO special characters 
*/
checkUserName = async (req, res, next) => {
  userName = _.get(req, 'body.userName');

  const user = await User.findOne({
    userName: userName
  });

  if (user) {
    res.status(400).send({ message: 'Username is already in use!' });
    return;
  }

  if (userName.length <= 3) {
    res.status(400).send({ message: 'Username too short.' });
    return;
  }

  if (userName.length >= 20) {
    res.status(400).send({ message: 'Username too long.' });
    return;
  }

  if (!userName.match(/[0-9a-zA-Z]/)) {
    res.status(400).send({
      message: 'Username should not contain special characters'
    });
    return;
  }
  next();
};

/*
The password should contain , 
longer than or equal to 8 characters,
shorter than or equal to 20 charaters
contain at least one lower case letter,
contain at least one upper case letter,
contain at least a digit,
contain no special characters
*/
checkPassword = (req, res, next) => {
  password = _.get(req, 'body.password');

  if (password.length <= 8) {
    res.status(400).send({ message: 'password too short.' });
    return;
  }

  if (password.length >= 20) {
    res.status(400).send({ message: 'password too long.' });
    return;
  }

  if (!password.match(/(?=.*[a-z])/)) {
    res.status(400).send({
      message: 'Password should contain at least one lower case letter'
    });
    return;
  }

  if (!password.match(/(?=.*[A-Z])/)) {
    res.status(400).send({
      message: 'Password should at least one upper case letter'
    });
    return;
  }

  if (!password.match(/(?=.*\d)/)) {
    res.status(400).send({
      message: 'Password should contain at least a digit'
    });
    return;
  }

  if (!password.match(/[0-9a-zA-Z]/)) {
    res.status(400).send({
      message: 'Password should not contain special characters'
    });
    return;
  }
  next();
};

// The DOB should be in dd-mm-yyyy format
checkDOB = (req, res, next) => {
  if (res.writableEnded) {
    next();
    return;
  }

  const DOB = _.get(req, 'body.DOB');

  if (!DOB) {
    next();
    return;
  }
  if (isNaN(strToDate(req.body.DOB))) {
    res.status(400).send({
      message: 'The Date of birth format should be dd-mm-yyyy'
    });
    return;
  }
  next();
  return;
};

const verifyUserInfo = {
  checkUserName,
  checkPassword,
  checkDOB
};

module.exports = verifyUserInfo;
