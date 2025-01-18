const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');

router.route('/pricing-add-update').post(pricingController.addOrUpdatePricing);
router.route('/pricing-details').post(pricingController.getPricingDetails);
router.route('/pricing-list').post(pricingController.listPricing);

module.exports = router;
