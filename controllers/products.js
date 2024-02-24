const path = require('path');
const Order = require('../models/orders');
const Product = require('../models/product');
const User = require('../models/user');
const currencyFormat = require('../utils/currency');
const fs = require('fs');

exports.getHome = (req, res, next) => {
  res.render('shop/home', {
    pageTitle: 'Home',
    user: req.session.user,
  });
};

exports.postOrder = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE, schema methods
  User.findById(req.session.user._id)
    .then((user) => user.addOrder(user))
    .then((response) => {
      if (response === 'Empty') {
        return res.redirect('/cart');
      }
      res.redirect('/orders');
    });
};

exports.getOrders = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  Order.find({ userId: req.session.user._id }).then((orders) => {
    res.render('shop/orders', {
      pageTitle: 'Orders',
      user: req.session.user,
      orders: orders,
      total: 0,
      convert: currencyFormat,
    });
  });
};

exports.getCart = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  User.findById(req.session.user._id) // so either a temporary user is created or and if user condition is needed
    .then((user) => user.populate('cart.items.productId'))
    .then((user) => {
      res.status(200).render('shop/cart', {
        pageTitle: 'Cart',
        cart: user.cart.items,
        user: req.session.user,
        create: req.user,
        false: false,
        true: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const { pageTitle, productId } = req.body;
  if (pageTitle !== 'Cart') {
    ///////////////////////////////// WORKING WITH MONGOOSE, schema methods
    User.findById(req.session.user._id)
      .then((user) => user.addToCart(productId))
      .then(() => res.status(201).redirect('/products'))
      .then((err) => (err ? console.log('err: ', err) : ''));
  } else {
    ///////////////////////////////// WORKING WITH MONGOOSE, schema methods
    User.findById(req.session.user._id)
      .then((user) => user.removeItem(productId))
      .then(() => res.status(200).redirect('/cart'))
      .catch((err) => (err ? console.log('err: ', err) : ''));
  }
};

exports.getProduct = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  if (req.params.productId) {
    Product.findById(req.params.productId)
      .then((product) =>
        res.render('shop/product', {
          pageTitle: 'Product',
          product: product,
          user: req.session.user,
        })
      )
      .catch((err) => console.log(err));
  } else {
    res.redirect('/');
  }
};

exports.getProducts = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  Product.find()
    .then((products) => {
      res.render('shop/products-list', {
        pageTitle: 'Products',
        products: products,
        user: req.session.user,
      });
    })
    .catch((err) => console.log(err));
};


exports.getInvoice = (req, res, next) => {
  console.log('req.session.user: ', req.session.user)
    console.log(req.params)
    const invoiceId = req.params.orderId;
    const invoiceName = `invoice-${invoiceId}.pdf`;
    const filePath = path.join('data', 'invoices', invoiceName);
    Order.findById(invoiceId)
    .then(order => {
      if(order.userId.toString() === req.session.user._id.toString()){
        fs.readFile(filePath, (err, data) => {
          if(err){
           return next(err);
          }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename" ' + invoiceName + '" ')
            res.send(data);
        })
      }
    })
}
