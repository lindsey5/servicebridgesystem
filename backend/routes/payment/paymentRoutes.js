import express from 'express';
import paymentController from '../../controllers/payment/paymentController.js';
const router = express.Router();

router.post('/link', paymentController.create_checkout_link);
router.get('/success', paymentController.payment_success);

export default router;