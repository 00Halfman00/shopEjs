const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { BSON } = require('mongodb');

var transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io', // only works for testing emails in development(sandbox)
  port: 2525,
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASS,
  },
});

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    user: req.session.user,
    note: req.flash('note')[0],
    inputMsg: { email: '', password: '' },
    valErrors: [],
    isInvalid: false
  });
};

exports.postLogin = (req, res, next) => {
  const { password, user, email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).render('auth/login', {
      pageTitle: 'Login',
      note: errors.array()[0].msg,
      inputMsg: { email: email, password: password },
      valErrors: errors.array(),
      isInvalid: true
    });
  } else {
    return bcrypt
      .compare(password, user.password)
      .then((match) => {
        if (match) {
          req.session.isAuthenticated = true;
          req.session.user = user;
          req.session.save((err) => {
           if(err) next(err);
            res.redirect('/');
          });
        } else {
          res.status(422).render('auth/login', {
            pageTitle: 'Login',
            note: 'Invalid Password',
            inputMsg: { email: email, password: password },
            valErrors: [{ path: 'password' }],
            isInvalid: true
          });
        }
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatus = 500;
        return next(error);
      })
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if(err) next(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Signup',
    user: req.session.user,
    note: false,
    inputMsg: { email: '', password: '' },
    valErrors: [],
    isInvalid: false
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        const user = new User({
          password: hash,
          email: email,
          cart: { items: [] },
        });
        return user
          .save()
          .then(() => {
            res.redirect('/login');
            transport.sendMail({
              from: '"👻" <shop_products.com>',
              to: email,
              subject: 'signed up',
              text: 'Welcome. You are now signed up and can log into account.',
              html: `
              <p>We hope you enjoy our products</p>
            `,
            });
          })
          .catch((err) => {
            const error = new Error(err);
            error.httpStatus = 500;
            return next(error);
          });
      });
    });
  } else {
    res.render('auth/login', {
      pageTitle: 'Signup',
      user: req.session.user,
      note: errors.array()[0].msg,
      inputMsg: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      valErrors: errors.array(),
      isInvalid: true
    });
  }
};

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Reset',
    user: req.session.user,
    note: req.flash('note')[0],
    isInvalid: false,
    valErrors: [],
  });
};

exports.postReset = (req, res, next) => {
  const errors = validationResult(req);
  crypto.randomBytes(32, (err, buf) => {
    if(err) next(err);
    const token = buf.toString('hex');
    `use link to reset password: href=http://localhost:3000/reset/${token}  `;
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          user.resetToken = token;
          user.resetTokenExp = Date.now() + 1000 * 60 * 60;
          return user.save();
        } else {
          // req.flash('note', 'Email was not found.');
          // res.redirect('/reset');
          res.status(422).render('auth/reset', {
            pageTitle: 'Reset',
            user: req.session.user,
            note: errors.array()[0].msg,
            isInvalid: true,
            valErrors: errors.array()
          });
        }
      })
      .then((user) => {
        if (user) {
          req.flash('note:', 'Link has been sent to email to reset password');
          res.redirect('/reset');
          return transport
            .sendMail({
              from: '"👻" <shop_products.com>',
              to: user.email,
              subject: 'reset password',
              html: `<div><p>Click on the link: <a href="https://localhost/reset/${token}"}>link</a> to reset password</p></div>`,
            })
            // .then((info) => console.log('message send: ', info.messageId));
        }
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatus = 500;
        return next(error);
      });
  });
};

exports.getSetPassword = (req, res, next) => {
  token = req.params.resetToken;
  User.findOne({ resetToken: token, resetTokenExp: { $gte: Date.now() } })
    .then((user) => {
      if (user) {
        res.render('auth/set-password', {
          pageTitle: 'New Password',
          userId: user.id.toString(),
          passwordToken: token,
          note: req.flash('note')[0],
          isInvalid: true
        });
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error);
    });
};

exports.postSetPassword = (req, res, next) => {
  const { userId, password, passwordToken } = req.body;

  if (password.trim() && password.length > 7) {
    User.findOne({
      _id: userId,
      resetToken: passwordToken,
      resetTokenExp: { $gte: Date.now() },
    })
      .then((user) => {
        return bcrypt.genSalt(12, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            user.password = hash;
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            return user.save();
          });
        });
      })
      .then(res.redirect('/login'))
      .catch((err) => {
        const error = new Error(err);
        error.httpStatus = 500;
        return next(error);
      });
  } else {
    // req.flash('note', 'Invalid password');
    // res.redirect('/reset-password');
    res.render('auth/set-password', {
      pageTitle: 'New Password',
      userId: userId,
      passwordToken: token,
      note: req.flash('note')[0],
      isInvalid: true
    });
  }
};




// exports.postLogin = (req, res, next) => {
//   const { password, user, email } = req.body;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     res.status(422).render('auth/login', {
//       pageTitle: 'Login',
//       note: errors.array()[0].msg,
//       inputMsg: { email: email, password: password },
//       valErrors: errors.array(),
//       isInvalid: true
//     });
//   } else {
//     return bcrypt
//       .compare(password, user.password)
//       .then((match) => {
//         console.log('do passwords match? ', match)
//         if (match) {
//           req.session.isAuthenticated = true;
//           req.session.user = user;
//           req.session.save((err) => {
//             err ? console.log(err) : '';
//             res.redirect('/');
//           });
//         } else {
//           req.flash('note', 'Invalid Password')
//           res.redirect('/login')
//           // res.status(422).render('auth/login', {
//           //   pageTitle: 'Login',
//           //   note: 'Invalid Password',
//           //   inputMsg: { email: email, password: password },
//           //   valErrors: [{ path: 'password' }],
//           // });
//         }
//       })
//       .catch((err) => {
//         const error = new Error(err);
//         error.httpStatus = 500;
//         return next(error);
//       })
//   }
// };
