const express = require('express');
const router = express.Router();


const {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  getAdminProducts,
  postEditProduct,
} = require('../controllers/admin');

router.get('/add-product', getAddProduct);
router.post('/add-product', postAddProduct);
router.get('/edit-product/:productId', getEditProduct);
router.post('/edit-product/:productId', postEditProduct);
router.get('/admin-products', getAdminProducts);
router.post('/delete-product', getAdminProducts);

exports.adminRoute = router;
