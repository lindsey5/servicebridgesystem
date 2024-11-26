import express from 'express';
import { getChatBotReponse } from '../../controllers/chatbot/chatbotController.js';

const router = express.Router();

router.post('/chat', getChatBotReponse)

export default router;3