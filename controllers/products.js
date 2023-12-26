const { Product } = require('../models/product');
const { Cart } = require('../models/cart');


exports.getHome = (req, res, next) => {
  res.render('shop/home', { pageTitle: 'Home' });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    res.render('shop/cart', { pageTitle: 'Cart', cart: cart });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Cart.add2Cart(productId, () => {
    if (req.body.page) {
      res.redirect(`products/${productId}`);
    }
    res.redirect('products');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', { pageTitle: 'Orders' });
};
exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.getById(id, (product) => {
    res.render('shop/product', { pageTitle: 'Products', product: product });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/products-list', {
      pageTitle: 'Products',
      products: products,
    });
  });
};
