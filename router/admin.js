const express = require('express');
const router = express.Router();

const {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
} = require('../controllers/admin');

router.get('/add-product', getAddProduct);
router.post('/add-product', postAddProduct);
router.get('/admin-products', getAdminProducts);

exports.adminRoute = router;
