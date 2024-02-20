const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

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
    valErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  console.log('req.body: ', req.body);
  const { password, user, email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).render('auth/login', {
      pageTitle: 'Login',
      note: errors.array()[0].msg,
      inputMsg: { email: email, password: password },
      valErrors: errors.array()
    });
  } else {
    return bcrypt.compare(password, user.password).then((match) => {
      if (match) {
        req.session.isAuthenticated = true;
        req.session.user = user;
        req.session.save((err) => {
          err ? console.log(err) : '';
          res.redirect('/');
        });
      } else {
        res.status(422).render('auth/login', {
          pageTitle: 'Login',
          note: 'Invalid Password',
          inputMsg: { email: email, password: password },
          valErrors: [{path: 'password'}]
        });
      }
    });
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
    inputMsg: { email: '', password: '' },
    valErrors: []
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  console.log(errors.array())
  if (errors.isEmpty()) {
    return bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        const user = new User({
          password: hash,
          email: email,
          cart: { items: [] },
        });
        return user.save();
      });

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
    });
  } else {
    console.log
    res.render('auth/login', {
      pageTitle: 'Signup',
      user: req.session.user,
      note: errors.array()[0].msg,
      inputMsg: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      valErrors: errors.array()
    });
  }
};

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Reset',
    user: req.session.user,
    note: req.flash('note')[0],
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buf) => {
    err ? console.log(err) : '';
    const token = buf.toString('hex');
    `use link to reset password: href=http://localhost:3000/reset/${token}  `;
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          user.resetToken = token;
          user.resetTokenExp = Date.now() + 1000 * 60 * 60;
          return user.save();
        } else {
          req.flash('note', 'Email was not found.');
          res.redirect('/reset');
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
            .then((info) => console.log('message send: ', info.messageId));
        }
      })
      .catch((err) => (err ? console.log(err) : ''));
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
        });
      }
    })
    .catch((err) => (err ? console.log(err) : ''));
};

exports.postSetPassword = (req, res, next) => {
  const { userId, password, passwordToken } = req.body;
  console.log('req.body: ', req.body);
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
      .catch((err) => (err ? console.log(err) : ''));
  } else {
    req.flash('note', 'Invalid password');
    res.redirect('/reset-password');
  }
};

// exports.postSignup = (req, res, next) => {
//   const { email, password } = req.body;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log('invalid email: ', errors.array()[0].msg);
//   } else console.log('is valid email: ', errors.array());
//   if (errors.isEmpty()) {
//     return User.findOne({ email: email })
//       .then((u) => {
//         if (u) {
//           res.status(409).render('auth/login', {
//             pageTitle: 'Signup',
//             note: 'USER WITH THAT EMAIL ALREADY EXIST',
//           });
//         } else {
//           return bcrypt.genSalt(12, function (err, salt) {
//             bcrypt.hash(password, salt, function (err, hash) {
//               const user = new User({
//                 password: hash,
//                 email: email,
//                 cart: { items: [] },
//               });
//               return user.save();
//             });
//             console.log('email: ', email);
//             res.redirect('/login');
//           });
//         }
//       })
//       .then((user) => {
//         user ? res.redirect('/login') : '';
//         return transport
//           .sendMail({
//             from: '"👻" <shop_products.com>',
//             to: email,
//             subject: 'signed up',
//             text: 'Welcome. You are now signed up and can log into account.',
//             html: `
//             <p>We hope you enjoy our products</p>
//           `,
//           })
//           .then((info) => console.log('message send: ', info.messageId));
//       })
//       .catch((err) => console.log(err));
//   } else {
//     res.status(422).render('auth/login', {
//       pageTitle: 'Signup',
//       note: errors.array()[0].msg,
//     });
//   }
// };
