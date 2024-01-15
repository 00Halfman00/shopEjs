const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', { pageTitle: 'Add Product', edit: false });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, image, description, price } = req.body;
  if (
    title.trim()[0] &&
    image.startsWith('http') &&
    description.trim()[0] &&
    price.trim()[0]
  ) {
    try {
      const product = new Product(title, image, description, price);
      product.save();
      res.status(201).redirect('/admin/admin-products');
    } catch (err) {
      throw new Error(err);
    }
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.status(200).render('admin/edit-product', {
      pageTitle: 'Product',
      product: product,
      edit: true,
    });
  } catch (err) {
    throw new Error(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    // by sending the req.body, looking up the product in the database is avoided
    await Product.updateById(req.body);
    res.status(200).redirect('/admin/admin-products');
  } catch (err) {
    throw new Error(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.deleteById(req.body.productId);
    res.status(200).redirect('/admin/admin-products');
  } catch (err) {
    throw new Error(err);
  }
};

exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.status(200).render('admin/products-list', {
      pageTitle: 'Admin Products',
      products: products,
      user: req.user,
    });
  } catch (err) {
    throw new Error(err);
  }
};
