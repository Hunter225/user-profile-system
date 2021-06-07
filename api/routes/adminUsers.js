const controller = require('../controllers/adminUsers.controller');
const express = require('express');
const router = express.Router();
const { authJwt } = require('../middlewares');
const _ = require('lodash');

router.patch(
  '/:id',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.patchUser
);

router.get('', [authJwt.verifyToken, authJwt.isAdmin], controller.getUsers);

module.exports = router;
