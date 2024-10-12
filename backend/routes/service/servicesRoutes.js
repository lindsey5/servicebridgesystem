import express from 'express';
import serviceController from '../../controllers/service/serviceController.js';

const router = express.Router();

router.get('/services', serviceController.service_findAll);
router.get('/services/:category', serviceController.services_byCategory);

export default router;