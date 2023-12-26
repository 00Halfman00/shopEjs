const { Product } = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', { pageTitle: 'Add Product', edit: false });
};

exports.postAddProduct = (req, res, next) => {
  // bot edit and add pages use this controller, so check to see if product exist before adding but how to send productId

  if (
    req.body.title.trim()[0] &&
    req.body.image.startsWith('http') &&
    req.body.description.trim()[0] &&
    req.body.price.trim()[0]
  ) {
    const product = new Product(req.body);
    product.save();
    res.redirect('/products');
  }
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.getById(productId, (product) => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      product: product,
      edit: true,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.getById(productId, (product) => {
    res.redirect('/products');
  });
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products-list', {
      pageTitle: 'Admin Products',
      products: products,
    });
  });
};
