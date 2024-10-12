import express from 'express';
import providerController from '../../controllers/provider/providerAuthController.js';

const router = express.Router();

router.post('/provider-signup', providerController.signup_post);
router.post('/provider-login', providerController.login_post);

export default router;