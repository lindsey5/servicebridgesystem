import express from 'express';
import earningController from '../../controllers/earning/earningController.js';
import { providerRequireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/provider/month', providerRequireAuth, earningController.get_provider_earning_per_month);
router.get('/provider/today', providerRequireAuth, earningController.get_provider_today_earnings);
router.get('/provider/history', providerRequireAuth, earningController.get_provider_earnings);
router.get('/company/month', earningController.get_company_earning_per_month);
router.get('/company/today', earningController.get_company_today_earnings);

export default router;