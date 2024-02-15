const express = require('express');
const router = express.Router();

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getSetPassword,
  postSetPassword
} = require('../controllers/auth');

router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.get('/signup', getSignup);
router.post('/signup', postSignup);
router.get('/reset', getReset);
router.post('/reset', postReset)
router.get('/reset/:resetToken', getSetPassword)
router.post('/set-password', postSetPassword)

exports.authRoute = router;
