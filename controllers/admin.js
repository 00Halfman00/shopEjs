const Product = require('../models/product');
const { Op } = require('sequelize');

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
      const product = await req.user.createProduct(req.body);
      res.status(201).redirect('/admin/admin-products');
    } catch (err) {
      throw new Error(err);
    }
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    // const product = await req.user.getProducts({where; {id: req.params.productId}});// returns an array(plural search)
    const product = await Product.findOne({
      where: {
        [Op.and]: [
          { id: req.params.productId },
          { UserId: req.user.dataValues.id },
        ],
      },
    });

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
    const product = await Product.findOne({
      where: {
        [Op.and]: [
          {id : req.body.id},
          {UserId: req.user.dataValues.id}
        ]
      }
    });
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
        [Op.and]: [
          {id: req.body.productId},
          {UserId: req.user.dataValues.id}
        ]
      },
    });
    res.status(200).redirect('/admin/admin-products');
  } catch (err) {
    throw new Error(err);
  }
};

exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await req.user.getProducts();
    res.status(200).render('admin/products-list', {
      pageTitle: 'Admin Products',
      products: products,
    });
  } catch (err) {
    throw new Error(err);
  }
};
