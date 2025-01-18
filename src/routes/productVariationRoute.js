const express = require('express');
const router = express.Router();
const productVariationController = require('../controllers/productVariationController');

router.route('/product-variation-add-update').post(productVariationController.addOrUpdateProductVariation);
router.route('/product-variation-details').post(productVariationController.getProductVariationDetails);
router.route('/product-variation-list').post(productVariationController.listProductVariations);

module.exports = router;
