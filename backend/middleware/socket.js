import { Server } from 'socket.io';
import ChatService from '../services/chatService.js';
import jwt from 'jsonwebtoken';

let io;

const initializeSocket = (server) => {
  const origin = process.env.NODE_ENV === 'production' ? 'https://servicebridgesystem.onrender.com' : 'http://localhost:5173';

  io = new Server(server, {
    cors: { 
      origin,
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true
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
      return next(new Error('Authentication error'));
    }
  });

  // Event listeners
  io.on('connection', (socket) => {
    console.log('A user connected with ID:', socket.id);

    socket.on('notifications', async ({recipient_id, message}) => {
      socket.to(recipient_id).emit('notification', message);
    });


    socket.on('chat-partners', async () => {
      try {
        const chatPartners = await ChatService.fetchChatPartners(socket.id);
        socket.emit('chat-partners', chatPartners);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('fetch messages', async (recipient) => {
      try {
        const pastMessages = await ChatService.fetchPastMessages(recipient, socket.id);
        socket.emit('past messages', pastMessages);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('private message', async ({ to, message }) => {
      try {
        const newMessage = await ChatService.createPrivateMessage(to, socket.id, message);
        socket.to(to).emit('private message', newMessage);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

const getIO = () => {
    if (!io) {
      throw new Error('Socket.io is not initialized!');
    }
    return io;
  };
  
  export { initializeSocket, getIO };