const { Product } = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', { pageTitle: 'Add Product', edit: false });
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
  const updatedProduct = {...req.body};
  Product.updateProduct(updatedProduct, (product) => {
    res.render('shop/product', { pageTitle: 'Product', product: product });
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
