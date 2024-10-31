import express from 'express';
import clientController from '../../controllers/client/clientController.js';
import { clientRequireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', clientRequireAuth, clientController.get_client);
router.get('/address/:id', clientController.get_client_address);
router.put('/update', clientRequireAuth, clientController.update_client);

export default router;