const Product = require('../models/product');

exports.getHome = (req, res, next) => {
  res.render('shop/home', { pageTitle: 'Home', user: req.user });
};

exports.postOrder = (req, res, next) => {
  req.user.addOrder();
  res.redirect('/');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    user: req.user,
    orders: req.user.getOrder(),
    total: 0,
  });
};

exports.getCart = (req, res, next) => {
  try {
    req.user
      .getCart()
      .then((cart) => {
        cart.cost = req.user.cost;
        return cart;
      })
      .then((cart) => {
        res.status(200).render('shop/cart', {
          pageTitle: 'Cart',
          cart: cart,
          user: req.user,
          create: req.user,
        });
      });

  } catch (err) {
    throw new Error(err);
  }
};

exports.postCart = async (req, res, next) => {
  const { productId, pageTitle } = req.body;
  try {
    if (pageTitle !== 'Cart') {
      const product = await Product.findById(productId);
      req.user.add2Cart(product);
      res.status(201).redirect('/products');
    } else {
      req.user.removeItem(productId);
      res.status(200).redirect('/cart');
    }
  } catch (err) {
    throw new Error(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.render('shop/product', { pageTitle: 'Product', product: product });
  } catch (err) {
    throw new Error(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render('shop/products-list', {
      pageTitle: 'Products',
      products: products,
      user: req.user,
    });
  } catch (err) {
    throw new Error(err);
  }
};
