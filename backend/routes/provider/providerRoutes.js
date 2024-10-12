import express from 'express';
import providerController from '../../controllers/provider/providerController.js';
import { providerRequireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', providerRequireAuth, providerController.get_provider);
router.get('/name/:id', providerController.get_provider_name);
router.post('/search-result', providerController.getProviders);

export default router;