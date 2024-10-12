import express from 'express';
import categoryController from '../../controllers/category/categoryController.js';

const router = express.Router();

router.get('/category', categoryController.get_categories);

export default router;