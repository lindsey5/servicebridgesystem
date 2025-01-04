import express from 'express';
import providerAuthController from '../../controllers/provider/providerAuthController.js';
import { providerRequireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.put('/api/provider/password', providerRequireAuth, providerAuthController.providerUpdatePassword);
router.post('/provider-signup', providerAuthController.signup_post);
router.post('/api/provider/signup/verification-code', providerAuthController.providerSignupVerificationCode);
router.post('/provider-login', providerAuthController.login_post);

export default router;