import express from 'express';
import providerController from '../../controllers/provider/providerController.js';
import { providerRequireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', providerRequireAuth, providerController.get_provider);
router.post('/search-result', providerController.searchProviders);
router.put('/update', providerRequireAuth, providerController.update_provider);
router.get('/rating/:id', providerController.get_provider_rating);
router.get('/count', providerController.get_providers_count);

export default router;