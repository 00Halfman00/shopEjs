const { Product } = require('../models/product');
const { Cart } = require('../models/cart');

exports.getHome = (req, res, next) => {
  res.render('shop/home', { pageTitle: 'Home' });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', { pageTitle: 'Orders' });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    res.render('shop/cart', { pageTitle: 'Cart', cart: cart });
  });
};

exports.postCart = (req, res, next) => {
  const { productId, pageTitle } = req.body;
  if (pageTitle !== 'Cart') {
    Cart.add2Cart(productId, () => {
      res.redirect('products');
    });
  } else {
    Cart.removeFromCart(productId, (products, callback) => {
      res.render('shop/cart', { pageTitle: 'Cart', cart: products });
    });
  }
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.getById(id)
    .then(([[product]]) => {
      res.render('shop/product', { pageTitle: 'Product', product: product });
    })
    .catch((err) => (err ? console.log(err) : ''));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render('shop/products-list', {
        pageTitle: 'Products',
        products: products,
      });
    })
    .catch((err) => (err ? console.log(err) : ''));
};
