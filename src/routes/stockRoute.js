const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.route('/stock-add-update').post(stockController.addOrUpdateStock);
router.route('/stock-details').post(stockController.getStockDetails);
router.route('/stock-list').post(stockController.listStocks);

module.exports = router;
