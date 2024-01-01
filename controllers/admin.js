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
    product
      .save()
      .then(() => {
        res.redirect('/products');
      })
      .catch((err) => (err ? console.log(err) : ''));
  }
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.getById(id)
    .then(([[product]]) => {
      res.render('admin/edit-product', {
        pageTitle: 'Product',
        product: product,
        edit: true,
      });
    })
    .catch((err) => (err ? console.log(err) : ''));
};

exports.postEditProduct = (req, res, next) => {
  const updatedProduct = { ...req.body };
  Product.updateProduct(updatedProduct)
    .then(() => {
      res.redirect('/admin/admin-products');
    })
    .catch((err) => (err ? console.log(err) : ''));
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId)
    .then(() => {
      res.redirect('/admin/admin-products');
    })
    .catch((err) => (err ? console.log(err) : ''));
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render('admin/products-list', {
        pageTitle: 'Admin Products',
        products: products,
      });
    })
    .catch((err) => (err ? console.log(err) : ''));
};
