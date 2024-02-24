const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    edit: false,
    isInvalid: false,
    user: req.session.user,
    valErrors: [],
    note: ''
  });
};

exports.postAddProduct = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  const { title, description, price } = req.body;
  const errors = validationResult(req);

  if (errors.isEmpty() && req.file) {

    const product = new Product({
      title: title,
      image: req.file.path,
      description: description,
      price: price,
      userId: req.session.user._id,
    });

    product
      .save()
      .then(() => {
        res.redirect('/admin/admin-products')
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatus = 500;
        return next(error);
      });
  } else {

    res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      edit: false,
      isInvalid: true,
      valErrors: errors.array(),
      product: {
        title: title,
        description: description,
        price: price,
      },
      user: req.session.user,
      note: errors.array()[0] ?  errors.array()[0].msg : 'file type must be png, jpg, or jpeg'
    });
  }
};

exports.getEditProduct = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  const { title, description, price } = req.body;
  const errors = validationResult(req);

  Product.findById(req.params.productId)
    .then((product) => {
      console.log('found product: ', product)
      if (!errors.isEmpty()) {

        res.status(422).render('admin/edit-product', {
          pageTitle: 'Product',
          product: product,
          inputMsg: { // error messages
            title: title,
            description: description,
            price: price,
          },
          edit: true,
          user: req.session.user,
          valErrors: errors.array(),
          note: errors.array()[0].msg
        });
      } else {

        res.render('admin/edit-product', {
          pageTitle: 'Product',
          product: product,
          edit: true,
          user: req.session.user,
          valErrors: [],
          note: ''
        });
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  //////////////////////////////// WORKING WITH MONGOOSE
  const { _id, title, description, price } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  Product.findById(_id)
    .then((product) => {
      if (
        product &&
        product.userId.toString() === req.session.user._id.toString()
      ) {
        if (errors.isEmpty()) {

          product.title = title;
          if(image){
            product.image = image.path;
          }
          product.description = description;
          product.price = price;
          return product
            .save()
            .then(() => res.status(200).redirect('/admin/admin-products'));
        } else {

          res.status(422).render('admin/edit-product', {
            pageTitle: 'Product',
            product: {
              _id: product._id,
              title: title,
              description: description,
              price: price,
            },
            edit: true,
            user: req.session.user,
            valErrors: errors.array(),
            note: errors.array()[0].msg
          });
        }
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  //////////////////////////////// WORKING WITH MONGOOSE
  Product.deleteOne({ _id: req.body.productId, userId: req.session.user._id })
    .then(() => res.status(200).redirect('/admin/admin-products'))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error);
    });
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
      .catch((err) => {
        const error = new Error(err);
        error.httpStatus = 500;
        return next(error);
      });
  } else {
    res.redirect('/');
  }
};
