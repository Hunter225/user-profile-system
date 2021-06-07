const controller = require('../controllers/users.controller');
const express = require('express');
const router = express.Router();
const { verifyUserInfo, authJwt } = require('../middlewares');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* POST a new user */
router.post(
  '/sign-up',
  [
    verifyUserInfo.checkUserName,
    verifyUserInfo.checkPassword,
    verifyUserInfo.checkDOB
  ],
  controller.signUp
);

/* POST a new user */
router.post('/sign-in', controller.signIn);

router.get('/:id', [authJwt.verifyToken, authJwt.isSameId], controller.getUser);

/* Patch the surname, given name and DOB of user */
router.patch(
  '/:id',
  [authJwt.verifyToken, authJwt.isSameId, verifyUserInfo.checkDOB],
  controller.patchUser
);

/* Delete use logically by patching status */
router.patch(
  '/delete/:id',
  [authJwt.verifyToken, authJwt.isSameId],
  controller.deleteUser
);

module.exports = router;
