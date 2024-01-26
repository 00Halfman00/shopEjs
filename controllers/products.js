const Order = require('../models/orders');
const Product = require('../models/product');

exports.getHome = (req, res, next) => {
  res.render('shop/home', { pageTitle: 'Home', user: req.user });
};

exports.postOrder = (req, res, next) => {
    ///////////////////////////////// WORKING WITH MONGOOSE, schema methods
  if (req.user.cart.items[0]) {
    req.user.addOrder().then(() => res.redirect('/cart'));
  }
};

exports.getOrders = (req, res, next) => {
    ///////////////////////////////// WORKING WITH MONGOOSE
  Order.find()
    .where(`${req.user._id} === userId`)
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        user: req.user,
        orders: orders,
        total: 0,
      });
    });
  // req.user.getOrders().then((orders) => {
  //   res.render('shop/orders', {
  //     pageTitle: 'Orders',
  //     user: req.user,
  //     orders: orders,
  //     total: 0,
  //   });
  // });
};

exports.getCart = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE, schema methods
  try {
    req.user.getCart().then((cart) => {
      res.status(200).render('shop/cart', {
        pageTitle: 'Cart',
        cart: cart,
        user: req.user,
        create: req.user,
        false: false,
        true: true,
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

exports.postCart = async (req, res, next) => {
  const { pageTitle, productId } = req.body;
  if (pageTitle !== 'Cart') {
    ///////////////////////////////// WORKING WITH MONGOOSE, schema methods
    const cart = await req.user.addToCart(productId);
    console.log('cart: ', cart);
    res.status(201).redirect('/products');
  } else {
    ///////////////////////////////// WORKING WITH MONGOOSE, schema methods
    req.user.removeItem(productId);
    res.status(200).redirect('/cart');
  }
};

exports.getProduct = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  Product.findById(req.params.productId)
    .then((product) =>
      res.render('shop/product', { pageTitle: 'Product', product: product })
    )
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  ///////////////////////////////// WORKING WITH MONGOOSE
  Product.find()
    .then((products) => {
      res.render('shop/products-list', {
        pageTitle: 'Products',
        products: products,
        user: req.user,
      });
    })
    .catch((err) => console.log(err));
};
