const { Product } = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', { pageTitle: 'Add Product' });
};

exports.postAddProduct = (req, res, next) => {
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

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products-list', {
      pageTitle: 'Admin Products',
      products: products,
    });
  });
};
