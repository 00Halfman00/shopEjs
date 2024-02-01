const { request } = require('express');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    edit: false,
    user: req.session.user,
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.postAddProduct = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  const { title, image, description, price } = req.body;
  if (
    title.trim()[0] &&
    image.startsWith('http') &&
    description.trim()[0] &&
    price.trim()[0]
  ) {
    const product = new Product({
      title: title,
      image: image,
      description: description,
      price: price,
      userId: req.session.user._id,
    });
    product
      .save()
      .then(() => res.status(201).redirect('/admin/admin-products'))
      .catch((err) => console.log(err));
  }
};

exports.getEditProduct = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  Product.findById(req.params.productId)
    .then((product) => {
      res.status(200).render('admin/edit-product', {
        pageTitle: 'Product',
        product: product,
        edit: true,
        user: req.session.user,
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  //////////////////////////////// WORKING WITH MONGOOSE
  Product.findByIdAndUpdate(req.body._id, req.body)
    .then(() => res.status(200).redirect('/admin/admin-products'))
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  //////////////////////////////// WORKING WITH MONGOOSE
  Product.deleteOne({ _id: req.body.productId })
    .then(() => res.status(200).redirect('/admin/admin-products'))
    .catch((err) => console.log(err));
};

exports.getAdminProducts = (req, res, next) => {
  //////////////////////////////// WORKING WITH MONGOOSE
  if(req.session.user){
    Product.find()
    .where(`${req.session.user._id} === userId`) //theoretically, get products for a particular admin
    .then((products) => {
      res.status(200).render('admin/products-list', {
        pageTitle: 'Admin Products',
        products: products,
        user: req.session.user,
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => console.log(err));
  } else {
    res.redirect('/')
  }
};
