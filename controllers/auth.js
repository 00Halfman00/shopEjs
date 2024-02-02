const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    user: req.session.user,
    note: false,
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (email.trim()[0] && password.trim()[0]) {
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          const note = 'USER NOT FOUND';
          res.render('auth/login', {
            pageTitle: 'Login',
            note: note,
            isAuthenticated: req.session.isAuthenticated,
          });
        }
        if(user){
          return bcrypt
          .compare(password, user.password)
          .then(() => {
            req.session.isAuthenticated = true;
            req.session.user = user;
            req.session.save((err) => {
              err ? console.log(err) : '';
              res.redirect('/');
            });
          })
        }
      })
      .catch((err) => console.log(err));
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
};

exports.getSignup = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Signup',
    user: req.session.user,
    note: false,
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (
    password.trim() &&
    confirmPassword.trim() &&
    password === confirmPassword &&
    password[0] &&
    password.length > 7 &&
    email.includes('@')
  ) {
    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        User.findOne({ email: email })
          .then((u) => {
            if (u) {
              return false;
            } else {
              const user = new User({
                password: hash,
                email: email,
                cart: { items: [] },
              });
              return user.save();
            }
          })
          .then((user) => {
            if (user) res.redirect('/login');
            else {
              const note = 'USER WITH THAT EMAIL ALREADY EXIST';
              res.render('auth/login', {
                pageTitle: 'Signup',
                note: note,
                isAuthenticated: req.session.isAuthenticated,
              });
            }
          })
          .catch((err) => console.log(err));
      });
    });
  }
};
