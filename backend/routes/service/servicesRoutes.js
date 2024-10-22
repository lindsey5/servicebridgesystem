import express from 'express';
import serviceController from '../../controllers/service/serviceController.js';

const router = express.Router();

router.get('/', serviceController.service_findAll);
router.get('/top', serviceController.get_top_services);
router.get('/:category', serviceController.services_byCategory);

export default router;