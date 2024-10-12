import express from 'express';
import clientController from '../../controllers/client/clientAuthController.js';

const router = express.Router();

router.post('/client-signup', clientController.signup_post);
router.post('/client-login', clientController.login_post);

export default router;
