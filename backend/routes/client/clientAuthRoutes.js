import express from 'express';
import clientAuthController from '../../controllers/client/clientAuthController.js';

const router = express.Router();

router.post('/api/client/signup/verification-code', clientAuthController.clientSignupVerificationCode);
router.post('/client-signup', clientAuthController.signup_post);
router.post('/client-login', clientAuthController.login_post);

export default router;
