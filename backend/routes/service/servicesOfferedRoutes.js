import express from 'express';
import servicesOfferedController from '../../controllers/service/servicesOfferedController.js';
import { providerRequireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', providerRequireAuth, servicesOfferedController.get_services_offered);
router.delete('/:id', providerRequireAuth, servicesOfferedController.delete_service_offered);
router.post('/', providerRequireAuth, servicesOfferedController.add_service_offered);
router.put('/:id', providerRequireAuth, servicesOfferedController.update_service_offered);

export default router;3