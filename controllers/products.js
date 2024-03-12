const path = require('path');
const Order = require('../models/orders');
const Product = require('../models/product');
const User = require('../models/user');
const currencyFormat = require('../utils/currency');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const product = require('../models/product');
const pageItems = 1;

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
    })
    .catch((err) => next(err));
};

exports.getOrders = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  Order.find({ userId: req.session.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        user: req.session.user,
        orders: orders,
        total: 0,
        convert: currencyFormat,
      });
    })
    .catch((err) => next(err));
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
    .catch((err) => next(err));
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
      .catch((err) => next(err));
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
      .catch((err) => next(err));
  } else {
    res.redirect('/');
  }
};

exports.getProducts = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  const page = +req.query.page || 1;
  let productsNum = 0;

  Product.countDocuments()
    .then(productCount => {
      productsNum = productCount;
      return Product.find()
      .skip((page - 1) * pageItems)
      .limit(pageItems)
    })
    .then((products) => {
      res.render('shop/products-list', {
        pageTitle: 'Products',
        products: products,
        user: req.session.user,
        currentPage: page,
        hasPrevPage: page > 1,
        hasNextPage: (pageItems * page) < productsNum,
        prevPage: page - 1,
        nextPage: page + 1,
        lastPage: Math.ceil((productsNum/pageItems))
      });
    })
    .catch((err) => next(err));
};

exports.getInvoice = (req, res, next) => {

  const invoiceId = req.params.orderId;
  const invoiceName = 'invoice-' + invoiceId + '.pdf';
  const filePath = path.join('data', 'invoices', invoiceName);
  Order.findById(invoiceId).then((order) => {
    if (!order) {
      return next(new Error('Order not found'));
    }
    if (order.userId.toString() === req.session.user._id.toString()) {

      const respond = `Order number: ${invoiceId}.`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename" ' + invoiceName + ' " '
      );
      const doc = new PDFDocument();
      doc.pipe(fs.WriteStream(filePath));
      doc.fontSize(26).text('Invoice', { align: 'center', underline: 'true', color: 'yellow' });
      doc.moveDown();
      doc.fontSize(12).text(new Date().toLocaleDateString());
      doc.moveDown();
      doc.moveDown();
      doc.text(respond);
      doc.moveDown();
      doc.moveDown();
      let total = 0;
      for (let i = 0; i < order.products.length; ++i) {
        const { title, price, quantity } = order.products[i];
        total += quantity * price;
        doc.text(
          `item:  |  ${title}  |   quantity: ${quantity}  |  price:   ${currencyFormat(price)}`,
          { align: 'center' }
        );
      }
      const farewell = 'Thank You for shopping at Shop Products.';
      doc.moveDown();
      doc.fontSize(18).text('Total:', { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(currencyFormat(total));
      doc.moveDown();
      doc.pipe(res);
      doc.end();
    } else {
      return next(new Error('Unauthorized'));
    }
  });
};
