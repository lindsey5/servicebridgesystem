import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/routes.js';
import { connectDB } from './config/connection.js';
import path from 'path';
import dotenv from 'dotenv';
import './Associations/EarningAssociations.js';
import './Associations/ServiceAssociations.js';
import './Associations/TransactionAssociations.js';
import './Associations/ProviderAssociations.js';
import './Associations/AvailableDateAssociations.js';
import ChatService from './services/chatService.js';
import { createServer } from 'http';
import cors from 'cors';
import { initializeSocket } from './middleware/socket.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT; 
const server = createServer(app);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Call all the routes
routes.useRoutes(app);

app.get('/logout', (req, res) => {
    res.clearCookie('jwt', { httpOnly: true, secure: false });
    res.redirect('/');
});

app.get('/api/latest-message', async (req, res) => {
  const {you, partner} = req.query;
  try{
    const latestMessage = await ChatService.fetchLatestMessage(you, partner);

    res.status(200).json(latestMessage)
  }catch(err){
    res.status(400).json({message: err});
  }

});

initializeSocket(server);

const __dirname = path.resolve();

// Now you can use __dirname
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Start the server and connect to the database
server.listen(PORT, () => {
  connectDB(); // Your DB connection logic
  console.log(`Server started at http://localhost:${PORT}`);
});