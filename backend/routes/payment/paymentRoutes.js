import express from 'express';
import paymentController from '../../controllers/payment/paymentController.js';
import { clientRequireAuth, providerRequireAuth } from '../../middleware/authMiddleware.js';
const router = express.Router();

router.post('/link/client', clientRequireAuth, paymentController.create_client_checkout_link);
router.get('/success/client', paymentController.client_payment_success);
router.post('/link/provider', providerRequireAuth, paymentController.create_provider_checkout_link);

export default router;