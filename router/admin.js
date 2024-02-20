const express = require('express');
const router = express.Router();
const { valid } = require('../utils/valid');
const { body, check } = require('express-validator');

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
      .isLength({ min: 3 })
      .isAlphanumeric()
      .withMessage('Title accepts letters and 3-20 characters'),
    body('image', 'Enter a valid URL').isURL({ protocols: ['https'] }),
    body('description', 'Description minimum is ten characters')
      .isLength({ min: 10, max: 250 })
      .trim(),
    body('price', 'Enter a valid price').isFloat().isLength({min: 2}),
  ],
  postAddProduct
);
router.get(
  '/edit-product/:productId',
  valid,
  [
    body('image', 'You must enter a valid URL')
      .isURL({ protocols: ['https'] })
      .exists(),
  ],
  getEditProduct
);
router.post(
  '/edit-product/:productId',
  valid,
  [
    body('title', 'Title min is three characters')
      .isLength({ min: 3 })
      .isAlphanumeric(),
    body('image', 'Enter a valid URL').isURL({ protocols: ['https'] }),
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
