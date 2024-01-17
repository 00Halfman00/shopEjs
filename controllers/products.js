const Product = require('../models/product');
const User = require('../models/user');


exports.getHome = (req, res, next) => {
  res.render('shop/home', { pageTitle: 'Home', user: req.user });
};

exports.postOrder = async (req, res, next) => {
  const {firstName, lastName, email, _id} = req.user;
  const storedUser = await User.findById(_id);
  const user = new User(firstName, lastName, email, storedUser.cart, storedUser.order, _id);
  user.addOrder();
  res.redirect('/')
};

exports.getOrders = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  console.log('user: ', user)
  res.render('shop/orders', {
    pageTitle: 'Orders',
    user: req.user,
    orders: user.order,
    total: 0,
  });
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).render('shop/cart', {
      pageTitle: 'Cart',
      cart: user.cart.items,
      user: req.user,
      create: req.user,
    });
  } catch (err) {
    throw new Error(err);
  }
};

exports.postCart = async (req, res, next) => {
  const { productId, pageTitle } = req.body;
  const { _id, firstName, lastName, email, orders } = req.user;
  try {
    const storedUser = await User.findById(_id);
    const user = new User(
      firstName,
      lastName,
      email,
      storedUser.cart,
      orders,
      _id
    );
    if (pageTitle !== 'Cart') {
      const product = await Product.findById(productId);
      user.add2Cart(product);
      res.status(201).redirect('/products');
    } else {
      // await cart.removeProduct(product);        NEEDS TO BE UPDATED SYNTAX IS FOR SEQUELIZE(CHANGE)
      res.status(200).redirect('/cart');
    }
  } catch (err) {
    throw new Error(err);
  }
};

exports.getProduct = async (req, res, next) => {
  console.log(req.params);
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




// const order =  await req.user.createOrder();
  // const cart = await req.user.getCart();
  // const products = await cart.getProducts();
  // products.forEach(async (element) => {
  //   const product = await Product.findByPk(element.id);
  //   const { quantity } = element.CartItem;
  //   order.addProduct(product, {
  //     through: { quantity: quantity },
  //   });
  // });
  // cart.setProducts(null);
