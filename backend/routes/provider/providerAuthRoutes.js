import express from 'express';
import providerAuthController from '../../controllers/provider/providerAuthController.js';

const router = express.Router();

router.post('/provider-signup', providerAuthController.signup_post);
router.post('/api/provider/signup/verification-code', providerAuthController.providerSignupVerificationCode);
router.post('/provider-login', providerAuthController.login_post);

export default router;