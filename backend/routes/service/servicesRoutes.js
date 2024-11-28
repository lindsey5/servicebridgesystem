import express from 'express';
import serviceController from '../../controllers/service/serviceController.js';

const router = express.Router();

router.post('/', serviceController.create_service);
router.get('/', serviceController.service_findAll);
router.get('/pagination', serviceController.get_paginated_services);
router.get('/top', serviceController.get_top_services);
router.get('/:category', serviceController.services_byCategory);

export default router;