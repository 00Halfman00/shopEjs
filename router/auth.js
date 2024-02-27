const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const expressVal = require('express-validator');
const User = require('../models/user');

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getSetPassword,
  postSetPassword,
} = require('../controllers/auth');

router.get('/login', getLogin);
router.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid Email')
      .normalizeEmail(),
    body('password', 'Password must be atleast 7 characters long')
      .isLength({
        min: 7,
      })
      .isAlphanumeric()
      .trim(),
    body('email').custom((value, { req }) => {
      return User.find({ email: value }).then((user) => {
        if (!user[0]) {
          throw new Error('There is no account with that email');
        }
        req.body.user = user[0];
        return true;
      });
    }),
  ],
  postLogin
);
router.post('/logout', postLogout);
router.get('/signup', getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid Email')
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.find({ email: value }).then((user) => {
          if (user[0]) {
            console.log('user: ', user);
            throw new Error('User with that email already exist');
          }
          return true;
        });
      }),
    body('password', 'Password must be atleast 7 characters long')
      .isLength({
        min: 7,
      })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (req.body.password !== value) {
          throw new Error('Passwords need to match');
        }
        return true;
      })
      .isLength({
        min: 7,
      })
      .isAlphanumeric()
      .trim(),
  ],
  postSignup
);
router.get('/reset', getReset);
router.post('/reset', [
  check('email')
      .isEmail()
      .withMessage('Please enter a valid Email')
      .normalizeEmail()
], postReset);
router.get('/reset/:resetToken', getSetPassword);
router.post('/set-password', postSetPassword);

exports.authRoute = router;
