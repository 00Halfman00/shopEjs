const express = require('express');
const router = express.Router();
const {valid} = require('../utils/valid')

const {
  getProducts,
  getHome,
  getCart,
  getOrders,
  getProduct,
  postCart,
  postOrder,
  getInvoice
} = require('../controllers/products');


router.get('/products', getProducts);
router.get('/product', getProduct);
router.get('/products/:productId', getProduct);
router.get('/cart', valid, getCart);
router.post('/cart', valid, postCart);
router.get('/orders', valid, getOrders);
router.post('/orders', valid, postOrder);
router.get('/orders/:orderId', valid, getInvoice)
router.get('/', getHome);

exports.shopRoute = router;
