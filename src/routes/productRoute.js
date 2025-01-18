const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.route('/product-add-update').post(productController.addOrUpdateProduct);
router.route('/product-details').post(productController.getProductDetails);
router.route('/product-list').post(productController.listProducts);

module.exports = router;
