import express from 'express';
import paymentController from '../../controllers/payment/paymentController.js';
const router = express.Router();

router.post('/link/client', paymentController.create_client_checkout_link);
router.get('/success/client', paymentController.client_payment_success);
router.post('/link/provider', paymentController.create_provider_checkout_link);
router.put('/refund/:transaction_id', paymentController.refund_payment);

export default router;