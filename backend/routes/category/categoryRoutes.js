import express from 'express';
import categoryController from '../../controllers/category/categoryController.js';

const router = express.Router();

router.post('/category', categoryController.create_category);
router.get('/category', categoryController.get_categories);
router.delete('/category/:category_name', categoryController.delete_category);

export default router;