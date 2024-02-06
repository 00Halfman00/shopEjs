const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    user: req.session.user,
    note: false,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (email.trim()[0] && password.trim()[0]) {
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          res.render('auth/login', {
            pageTitle: 'Login',
            note: 'USER NOT FOUND',
          });
        } else if (user) {
          return bcrypt.compare(password, user.password).then((match) => {
            if (match) {
              req.session.user = user;
              req.session.save((err) => {
                err ? console.log(err) : '';
                res.redirect('/');
              });
            } else {
              res.render('auth/login', {
                pageTitle: 'Login',
                note: 'INVALID PASSWORD',
              });
            }
          });
        }
      })
      .catch((err) => console.log(err));
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    err ? console.log('err: ', err) : '';
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Signup',
    user: req.session.user,
    note: false,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (
    password.trim() &&
    confirmPassword.trim() &&
    password === confirmPassword &&
    password.length > 7 &&
    email.includes('@')
  ) {
    User.findOne({ email: email })
      .then((u) => {
        if (u) {
          res.render('auth/login', {
            pageTitle: 'Signup',
            note: 'USER WITH THAT EMAIL ALREADY EXIST',
          });
        } else {
          bcrypt.genSalt(12, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
              const user = new User({
                password: hash,
                email: email,
                cart: { items: [] },
              });
              return user.save();
            });
          });
        }
      })
      .then((user) => res.redirect('/login'))
      .catch((err) => console.log(err));
  } else {
    res.render('auth/login', {
      pageTitle: 'Signup',
      note: 'PASSWORDS DO NOT MATCH',
    });
  }
};
