import express from 'express';
import AvailableDateController from '../../controllers/available_dates/AvailableDateController.js';
import { providerRequireAuth } from '../../middleware/authMiddleware.js';
const router = express.Router();

router.get('/provider/available-dates', AvailableDateController.get_available_dates);

router.get('/provider/available-date', providerRequireAuth, AvailableDateController.get_available_date);

router.post('/provider/available-date', providerRequireAuth, AvailableDateController.create_available_date);

router.get('/available-date/id', AvailableDateController.get_date_id);

router.get('/available-date/:id', AvailableDateController.get_date );

export default router;
