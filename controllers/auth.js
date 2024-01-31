const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    user: req.session.user,
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (
    email &&
    email === '00johnrambo00@somesome.com' &&
    password &&
    password === 'getSomeSome'
  ) {
    User.findOne({ email: email })
      .then((user) => {
        req.session.isAuthenticated = true;
        req.session.user = user;
        res.redirect('/');
      })
      .catch((err) => (err ? console.log(err) : ''));
  } else {
    res.redirect('/');
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
};
