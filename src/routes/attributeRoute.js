const express = require('express');
const router = express.Router();
const attributeController = require('../controllers/attributeController');

router.route('/attribute-add-update').post(attributeController.addOrUpdateAttribute);
router.route('/attribute-details').post(attributeController.getAttributeDetails);

router.route('/attribute-list').get(attributeController.listAttributes);
router.route('/attribute-list').post(attributeController.listAttributes);

module.exports = router;
