import express from 'express';
import transactionController from '../../controllers/transaction/transactionController.js';
import verifyToken from '../../middleware/verifyToken.js';
import { providerRequireAuth, clientRequireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/transaction', clientRequireAuth, transactionController.create_transaction);

router.post('/client/transactions', clientRequireAuth, transactionController.get_client_transactions);

router.post('/provider/transactions', providerRequireAuth, transactionController.get_provider_transactions);

router.put('/transaction/cancel/:id', verifyToken, transactionController.cancel_transaction);

router.put('/transaction/update/:id',verifyToken, transactionController.update_transaction);

router.put('/transaction/complete/:id/client', clientRequireAuth, transactionController.client_complete_transaction);

router.get('/transaction/complete/:id/provider',  providerRequireAuth, transactionController.provider_complete_transaction);

router.put('/transaction/fail/:id', verifyToken, transactionController.fail_transaction);

router.get('/transaction/cancelled/:id', verifyToken, transactionController.get_cancelled_transaction);

router.get('/provider/completed/transaction/total', providerRequireAuth, transactionController.get_total_completed_task);

router.get('/provider/completed/transaction/total/today', providerRequireAuth, transactionController.get_total_completed_transaction_today);

router.get('/provider/completed/transaction/today', providerRequireAuth, transactionController.get_completed_transaction_today);

router.get('/transactions/:date', providerRequireAuth, transactionController.get_transactions_by_date);

router.put('/transaction/:id/review', clientRequireAuth, transactionController.review_transaction);

router.get('/transaction/:id/reviewed', verifyToken, transactionController.get_reviewed_transaction);

router.get('/transactions/reviewed/:provider', transactionController.get_reviewed_transactions);

export default router;