const express = require('express');
const router = express.Router();

const {
  getProducts,
  getHome,
  getCart,
  getOrders,
  getProduct,
  postCart,
} = require('../controllers/products');


router.get('/products', getProducts);
router.get('/cart', getCart);
router.post('/cart', postCart);
router.get('/orders', getOrders);
router.get('/products/:productId', getProduct);
router.get('/', getHome);

exports.shopRoute = router;
