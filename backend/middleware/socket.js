import { Server } from 'socket.io';
import ChatService from '../services/chatService.js';
import cookie from 'cookie';
import jwt from 'jsonwebtoken'

let initializedSocket;


const initializeSocket = (server) => {
  const origin = process.env.NODE_ENV === 'production' ? 'https://servicebridgesystem.onrender.com' : 'http://localhost:5173';

  const io = new Server(server, {
    cors: { 
      origin,
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true
    }
  });

  // Event listeners
  io.on('connection', (socket) => {
    console.log('A user connected with ID:', socket.id);

    initializedSocket = socket;

    const cookies = cookie.parse(socket.handshake.headers.cookie || '');

    // Get the 'jwt' token from the cookies
    const token = cookies.jwt;

    if (!token) {
      console.log('No JWT token found in cookies');
      socket.disconnect();  // Disconnect if no token is present
      return;
    }
    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the socket
    socket.user = decodedToken;

    socket.on('notifications', async ({recipient_id, message}) => {
      socket.to(recipient_id).emit('notification', message);
    });

    socket.on('chat-partners', async () => {
      try {
        const chatPartners = await ChatService.fetchChatPartners(socket.user.id);
        const completedChatPartners = await Promise.all(chatPartners.map(async (partner) => {
          const latestMessage = await ChatService.fetchLatestMessage(socket.user.id, partner)
          
          return { partner, latestMessage}
        }))
        socket.emit('chat-partners', completedChatPartners);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('fetch messages', async (recipient) => {
      try {
        const pastMessages = await ChatService.fetchPastMessages(recipient, socket.user.id);
        socket.emit('past messages', pastMessages);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('private message', async ({ to, message }) => {
      try {
        const newMessage = await ChatService.createPrivateMessage(to, socket.user.id, message);
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

  export { initializeSocket, initializedSocket };