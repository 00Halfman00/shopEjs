const express = require('express');
const router = express.Router();
const {status500} = require('../controllers/errors')

router.get('/err/500', status500 );

exports.errRouter = router;
