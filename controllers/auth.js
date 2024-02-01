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
    User.findOne({ email: email }).then((user) => {
      req.session.isAuthenticated = true;
      req.session.user = user;
      req.session.save((err) => {
        err ? console.log(err) : '';
        res.redirect('/');
      });
    });
  } else {
    res.redirect('/login');
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
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  console.log('post signup')
  if (
    password.trim()[0] &&
    confirmPassword.trim()[0] &&
    password === confirmPassword &&
    password.lenght > 7 &&
    email.includes('@')
  ) {
    User.findOne({ email: email })
      .then((u) => {
        if (u) {
          res.redirect('/signup');
        } else {
          const user = new User({
            password: password,
            email: email,
            cart: { items: [] },
          });
          return user.save();
        }
      })
      .then(() => {
        res.redirect('/login');
      });
  }

  // res.render('auth/login', {
  //   pageTitle: 'Signup',
  //   user: req.session.user,
  //   isAuthenticated: req.session.isAuthenticated,
  // });
};
