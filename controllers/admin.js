const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', { pageTitle: 'Add Product', edit: false });
};

exports.postAddProduct = async (req, res, next) => {
  if (
    req.body.title.trim()[0] &&
    req.body.image.startsWith('http') &&
    req.body.description.trim()[0] &&
    req.body.price.trim()[0]
  ) {
    try {
      const product = await Product.create(req.body);
      res.status(201).redirect('/admin/admin-products');
    } catch (err) {
      throw new Error(err);
    }
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId);
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
    const product = await Product.findByPk(req.body.id);
    product.set({ ...req.body });
    await product.save();
    res.status(200).redirect('/admin/admin-products');
  } catch (err) {
    throw new Error(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.destroy({
      where: {
        id: req.body.productId,
      },
    });
    res.status(200).redirect('/admin/admin-products');
  } catch (err) {
    throw new Error(err);
  }
};

exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.status(200).render('admin/products-list', {
      pageTitle: 'Admin Products',
      products: products,
    });
  } catch (err) {
    throw new Error(err);
  }
};
