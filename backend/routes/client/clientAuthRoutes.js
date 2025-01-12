import express from 'express';
import clientAuthController from '../../controllers/client/clientAuthController.js';
import { clientRequireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/api/client/verification-code', clientAuthController.clientSendVerificationCode)
router.put('/api/client/reset-password', clientAuthController.clientResetPassword)
router.put('/api/client/password', clientRequireAuth, clientAuthController.clientUpdatePassword);
router.post('/api/client/signup/verification-code', clientAuthController.clientSignupVerificationCode);
router.post('/client-signup', clientAuthController.signup_post);
router.post('/client-login', clientAuthController.login_post);

export default router;
