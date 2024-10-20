import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/routes.js';
import jwt from 'jsonwebtoken';
import { connectDB } from './config/connection.js';
import path from 'path';
import dotenv from 'dotenv';
import './Associations/EarningAssociations.js';
import './Associations/ServiceAssociations.js';
import './Associations/TransactionAssociations.js';
import './Associations/ProviderAssociations.js';
import ChatService from './services/chatService.js';
import { Server } from 'socket.io';
import { createServer } from 'http';

dotenv.config();
const app = express();
const PORT = process.env.PORT; 
const server = createServer(app);
const origin = server;
const io = new Server({
  cors: { 
    origin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true
   }
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use(express.json());
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

// Socket authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
        console.log('No token');
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.id = decoded.id;
        next();
    } catch (err) {
        console.log(err);
        return next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
  console.log('A user connected with ID:', socket.id);
  
  // Handle fetching chat partners
  socket.on('chat-partners', async () => {
    console.log('chat-partners emmited');
    try{
      const chatPartners = await ChatService.fetchChatPartners(socket.id);
      socket.emit('chat-partners', chatPartners);

    }catch(err){
      console.log(err);
    }
  });

  // Handle fetching past messages
  socket.on('fetch messages', async (recipient) => {
    try{
      const pastMessages = await ChatService.fetchPastMessages(recipient, socket.id);
      // Send past messages to client
      socket.emit('past messages', pastMessages);
    }catch(err){
      console.log(err);
    }
  });

    // Handle private messaging
    socket.on('private message', async ({ to, message }) => {
      try{
        // Save message to the database
        const newMessage = await ChatService.createPrivateMessage(to, socket.id, message);
        // Emit the new message to the recipient
        socket.to(to).emit('private message', newMessage);
      }catch(err){
        console.error(err);
      }
    });

  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });
});

io.listen(process.env.PORT || 4000)

const __dirname = path.resolve();

// Now you can use __dirname
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

/*app.listen(PORT, ()=>{
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});*/

// Start the server and connect to the database
server.listen(PORT, () => {
  connectDB(); // Your DB connection logic
  console.log(`Server started at http://localhost:${PORT}`);
});

