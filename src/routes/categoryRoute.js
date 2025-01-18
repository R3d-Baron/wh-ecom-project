const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.route('/category-list').post(categoryController.categoryList);
router.route('/category-add-update').post(categoryController.categoryAddUpdate);
router.route('/category-details').post(categoryController.getCategoryDetails);
router.route('/category-delete').post(categoryController.deleteCategory);

module.exports = router;
