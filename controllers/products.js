const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

exports.getHome = (req, res, next) => {
  console.log(req.user)
  res.render('shop/home', { pageTitle: 'Home', user: req.user.dataValues });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', { pageTitle: 'Orders' });
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    res.status(200).render('shop/cart', { pageTitle: 'Cart', cart: products });
  } catch (err) {
    throw new Error(err);
  }
};

exports.postCart = async (req, res, next) => {
  const { productId, pageTitle } = req.body;
  try {
    const cart = await req.user.getCart();
    const product = await Product.findByPk(productId);
    await cart.addProduct(product);
    if (pageTitle !== 'Cart') {
      await cart.addProduct(product);
      res.status(201).redirect('/products');
    } else {
      await cart.removeProduct(product);
      res.status(200).redirect('/cart');
    }
  } catch (err) {
    throw new Error(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    res.render('shop/product', { pageTitle: 'Product', product: product });
  } catch (err) {
    throw new Error(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('shop/products-list', {
      pageTitle: 'Products',
      products: products,
    });
  } catch (err) {
    throw new Error(err);
  }
};
