import { Server } from 'socket.io';
import ChatService from '../services/chatService.js';
import cookie from 'cookie';
import jwt from 'jsonwebtoken'
import Message from '../models/message.js';
import provider_account from '../models/provider-account.js';
import client_account from '../models/client-account.js';
import Notification from '../models/notification.js';

let initializedSocket;
const userSocketMap = new Map();

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
    userSocketMap.set(socket.user.id, socket.id);
    
    socket.on('seen', async(partner) => {
      try{
        await Message.update({status: 'Seen'}, {
          where: {
            to_user_id: socket.user.id, 
            from_user_id: partner
          }
        })

      }catch(err){
        console.log(err)
      }
    })

    socket.on('notifications', async () => {
      socket.emit('notifications');
    });

    socket.on('chat-partners', async () => {
      try {
        const chatPartners = await ChatService.fetchChatPartners(socket.user.id);
        const completedChatPartners = await Promise.all(chatPartners.map(async (partner) => {
          const latestMessage = await ChatService.fetchLatestMessage(socket.user.id, partner)
          const deliveredMessages = await Message.count({
            where: {
              to_user_id: socket.user.id,
              from_user_id: partner,
              status: 'Delivered'
            }
          })
          const provider = await provider_account.findByPk(partner);
          const client = await client_account.findByPk(partner);

          const userDetails = provider ? provider.dataValues :  client.dataValues;
          return { partner, latestMessage: latestMessage.dataValues, deliveredMessages: deliveredMessages, userDetails}
        }))
        socket.emit('chat-partners', completedChatPartners);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('delivered messages', async() => {
      try{
        const deliveredMessages = await Message.count({
          where: {
            to_user_id: socket.user.id,
            status: 'Delivered'
          }
        })

        socket.emit('delivered messages', deliveredMessages)

      }catch(err){
        console.log(err)
      }

    })

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
        const recipientSocketId = userSocketMap.get(to);

        const newMessage = await ChatService.createPrivateMessage(to, socket.user.id, message);
        socket.to(recipientSocketId).emit('private message', newMessage);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('notifications', async(limit) => {
      try{
        const notifications = await Notification.findAll({
          where: {
            recipient_id: socket.user.id
          },
          limit,
          order: [
            ['created_at', 'DESC']
          ]
        });

        const unread = await Notification.count({
          where: {
            recipient_id: socket.user.id,
            status: 'unread'
          }
        })

        const completeNotifications = await Promise.all(notifications.map(async(notification) => {
          const provider = await provider_account.findByPk(notification.dataValues.sender_id);
          const client = await client_account.findByPk(notification.dataValues.sender_id);
          
          return {...notification.toJSON(), sender: provider ? provider.toJSON() : client.toJSON(), }

        }))
        socket.emit('notifications', {notifications: completeNotifications, unread});
      }catch(err){
        console.log(err);
      }
    })

    socket.on('read-notifications', async () => {
      try{
        await Notification.update({ status: 'read' },{
          where: {
            recipient_id: socket.user.id,
            status: 'unread'
          }
        }) 

      }catch(err){
        console.log(err)
      }
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      userSocketMap.delete(socket.user.id);
    });
  });
};

  export { initializeSocket, initializedSocket, userSocketMap };