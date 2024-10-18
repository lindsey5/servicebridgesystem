import express from 'express';
import { providerRequireAuth } from '../../middleware/authMiddleware.js';
import providerBalanceController from '../../controllers/provider/providerBalanceController.js';

const router = express.Router();

router.get('/', providerRequireAuth, providerBalanceController.get_balance);

export default router;