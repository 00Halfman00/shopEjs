const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    edit: false,
    user: req.session.user,
    valErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  const { title, image, description, price } = req.body;
  const errors = validationResult(req);
  console.log('postAddProduct: ', errors.array());
  if (errors.isEmpty()) {
    const product = new Product({
      title: title,
      image: image,
      description: description,
      price: price,
      userId: req.session.user._id,
    });
    product
      .save()
      .then(() => {
        res.render('admin/admin-products', {
          pageTitle: 'Addmin Products',
          edit: false,
          note: '',
          user: req.session.user,
        });
      })
      .catch((err) => console.log(err));
  } else {
    res.status(422).render('admin/edit-product', {
      pageTitle: 'Addmin Products',
      edit: true,
      valErrors: errors.array(),
      product: {
        title: title,
        image: image,
        description: description,
        price: price,
      },
      user: req.session.user,
    });
  }
};

exports.getEditProduct = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  const { title, image, description, price } = req.body;
  const errors = validationResult(req);
  console.log('in getEditProduct: ', errors.array());
  Product.findById(req.params.productId)
    .then((product) => {
      if (!errors.isEmpty()) {
        res.status(422).render('admin/edit-product', {
          pageTitle: 'Product',
          inputMsg: {
            title: title,
            image: image,
            description: description,
            price: price,
          },
          edit: true,
          user: req.session.user,
          valErrors: errors.array(),
        });
      } else {
        res.status.render('admin/edit-product', {
          pageTitle: 'Product',
          product: {},
          edit: true,
          user: req.session.user,
          valErrors: [],
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  //////////////////////////////// WORKING WITH MONGOOSE
  const { _id, title, image, description, price } = req.body;
  const errors = validationResult(req);
  console.log('errors: ', errors.array());
  Product.findById(_id)
    .then((product) => {
      if (
        product &&
        product.userId.toString() === req.session.user._id.toString()
      ) {
        if (errors.isEmpty()) {
          product.title = title;
          product.image = image;
          product.description = description;
          product.price = price;
          return product
            .save()
            .then(() => res.status(200).redirect('/admin/admin-products'));
        } else {
          res.status(422).render('admin/edit-product', {
            pageTitle: 'Product',
            product: {
              title: title,
              image: image,
              description: description,
              price: price,
            },
            edit: true,
            user: req.session.user,
            valErrors: errors.array(),
          });
        }
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  //////////////////////////////// WORKING WITH MONGOOSE
  Product.deleteOne({ _id: req.body.productId, userId: req.session.user._id })
    .then(() => res.status(200).redirect('/admin/admin-products'))
    .catch((err) => console.log(err));
};

exports.getAdminProducts = (req, res, next) => {
  //////////////////////////////// WORKING WITH MONGOOSE
  if (req.session.user) {
    Product.find({ userId: req.session.user._id })
      .then((products) => {
        res.status(200).render('admin/products-list', {
          pageTitle: 'Admin Products',
          products: products,
          user: req.session.user,
        });
      })
      .catch((err) => console.log(err));
  } else {
    res.redirect('/');
  }
};
