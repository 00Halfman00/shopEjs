const Order = require('../models/orders');
const Product = require('../models/product');
const User = require('../models/user');
const currencyFormat = require('../utils/currency');

exports.getHome = (req, res, next) => {
  res.render('shop/home', {
    pageTitle: 'Home',
    user: req.session.user || req.user,
    isAuthenticated: req.session.isAuthenticated || false,
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
      isAuthenticated: req.session.isAuthenticated,
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
        user: req.session.user || req.user,
        create: req.user,
        false: false,
        true: true,
        isAuthenticated: req.session.isAuthenticated,
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
  Product.findById(req.params.productId)
    .then((product) =>
      res.render('shop/product', {
        pageTitle: 'Product',
        product: product,
        user: req.session.user,
        isAuthenticated: req.session.isAuthenticated,
      })
    )
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  Product.find()
    .then((products) => {
      res.render('shop/products-list', {
        pageTitle: 'Products',
        products: products,
        user: req.session.user,
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => console.log(err));
};
