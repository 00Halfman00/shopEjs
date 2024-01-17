const express = require('express');
const router = express.Router();

const {
  getProducts,
  getHome,
  getCart,
  getOrders,
  getProduct,
  postCart,
  postOrder
} = require('../controllers/products');


router.get('/products', getProducts);
router.get('/product', getProduct)
router.get('/cart', getCart);
router.post('/cart', postCart);
router.get('/orders', getOrders);
router.post('/orders', postOrder);
router.get('/products/:productId', getProduct);
router.get('/', getHome);

exports.shopRoute = router;
