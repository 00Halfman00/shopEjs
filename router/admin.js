const express = require('express');
const router = express.Router();
const {valid} = require('../utils/valid');


const {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  getAdminProducts,
  postEditProduct,
  deleteProduct
} = require('../controllers/admin');

router.get('/add-product', valid, getAddProduct);
router.post('/add-product', valid, postAddProduct);
router.get('/edit-product/:productId', valid, getEditProduct);
router.post('/edit-product/:productId', valid, postEditProduct);
router.get('/admin-products', valid, getAdminProducts);
router.post('/delete-product', valid, deleteProduct);

exports.adminRoute = router;
