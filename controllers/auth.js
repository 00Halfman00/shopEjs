const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAIL,
  server: 'localhost:3000',
});

mailchimp.ping
  .get()
  .then((response) => console.log('response: ', response))
  .catch((err) => {
    err ? console.log('err: ', err) : '';
  });

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    user: req.session.user,
    note: req.flash('note')[0],
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (email.includes('@') && email.trim()[0] && password.trim()[0]) {
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          // when there is a problem, render seems to be the better option; with success, redirect
          req.flash('note', 'USER NOT FOUND');
          res.redirect('/login');
        } else if (user) {
          return bcrypt.compare(password, user.password).then((match) => {
            if (match) {
              req.session.isAuthenticated = true;
              req.session.user = user;
              req.session.save((err) => {
                err ? console.log(err) : '';
                res.redirect('/');
              });
            } else {
              req.flash('note', 'INVALID PASSWORD');
              res.redirect('/login');
            }
          });
        }
      })
      .catch((err) => console.log(err));
  } else {
    req.flash('note', 'INVALID EMAIL OR PASSWORD');
    res.redirect('/login');
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
          res.status(409).render('auth/login', {
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
      .then((user) => (user ? res.redirect('/login') : ''))
      .catch((err) => console.log(err));
  } else {
    res.status(401).render('auth/login', {
      pageTitle: 'Signup',
      note: "INVALID EMAIL OR PASSWORDS DON'T MATCH",
    });
  }
};
