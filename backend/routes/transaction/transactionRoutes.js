import express from 'express';
import transactionController from '../../controllers/transaction/transactionController.js';
import verifyToken from '../../middleware/verifyToken.js';
import { providerRequireAuth, clientRequireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/transactions', clientRequireAuth, transactionController.create_transaction);

router.post('/client/transactions', clientRequireAuth, transactionController.get_client_transactions);

router.post('/provider/transactions', providerRequireAuth, transactionController.get_provider_transactions);

router.put('/transactions/cancel/:id', verifyToken, transactionController.cancel_transaction);

router.put('/transactions/update/:id',verifyToken, transactionController.update_transaction);

router.put('/transactions/complete/:id/client', transactionController.client_complete_transaction);

router.get('/transactions/complete/:id/provider',  transactionController.provider_complete_transaction);

router.put('/transactions/expire/:id', transactionController.expire_transaction);

router.get('/transactions/cancelled/:id', transactionController.get_cancelled_transaction);

router.get('/provider/completed/transaction/total', providerRequireAuth, transactionController.get_total_completed_task);

router.get('/provider/completed/transaction/total/today', providerRequireAuth, transactionController.get_total_completed_transaction_today);

router.get('/provider/completed/transaction/today', providerRequireAuth, transactionController.get_completed_transaction_today);

router.get('/transactions/:date', providerRequireAuth, transactionController.get_transactions_by_date);

router.put('/transactions/review/:id', clientRequireAuth, transactionController.review_transaction);

router.get('/transactions/reviewed/:id', transactionController.get_reviewed_transaction);

export default router;