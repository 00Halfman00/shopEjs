const express = require('express');
const router = express.Router();
const { valid } = require('../utils/valid');
const { body } = require('express-validator');

const {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  getAdminProducts,
  postEditProduct,
  deleteProduct,
} = require('../controllers/admin');

router.get('/add-product', valid, getAddProduct);
router.post(
  '/add-product',
  valid,
  [
    body('title')
      .isLength({ min: 1 })
      .trim()
      .withMessage('Title accepts 3-20 alpphanumeric characters'),
    body('description', 'Description minimum is ten characters')
      .isLength({ min: 10, max: 250 })
      .trim(),
    body('price', 'Enter a valid price').isFloat().isLength({ min: 2 }),
  ],
  postAddProduct
);
router.get('/edit-product/:productId', valid, getEditProduct);
router.post(
  '/edit-product/:productId',
  valid,
  [
    body('title', 'Title min is three characters').trim().isLength({ min: 1 }),
    body('description', 'Description minimum is ten characters')
      .isLength({ min: 10, max: 250 })
      .trim(),
    body('price', 'Enter a valid price that is a number').isFloat(),
  ],
  postEditProduct
);
router.get('/admin-products', valid, getAdminProducts);
router.post('/delete-product', valid, deleteProduct);

exports.adminRoute = router;
