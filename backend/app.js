import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/routes.js';
import jwt from 'jsonwebtoken';
import Client from './models/client-account.js';
import Provider from './models/provider-account.js';
import { connectDB } from './config/connection.js';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import './Associations/EarningAssociations.js';
import './Associations/ServiceAssociations.js';
import './Associations/TransactionAssociations.js';
import './Associations/ProviderAssociations.js';
import ChatService from './services/chatService.js';
dotenv.config();
import { Server } from 'socket.io';
import Transaction from './models/transaction.js';
import transactionService from './services/transactionService.js';
const origin = process.env.NODE_ENV === "production" ? "http://localhost:3000" : "http://localhost:5173";
const io = new Server({
  cors: { origin }
});

const app = express();
const PORT = process.env.PORT; 

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

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

app.get('/api/get/user-details/:id', async(req, res) => {
  try{
    const id = req.params.id;
    if(id){
      const client = await Client.findOne({where: {id}});
      const provider = await Provider.findOne({where: {id}});
      if(client){
        const fullname = client.firstname + " " + client.lastname;
        return res.status(200).json({fullname, profile_pic: client.profile_pic});
      }

      if(provider){
        const fullname = provider.firstname + " " + provider.lastname;
        return res.status(200).json({fullname, profile_pic: provider.profile_pic});
      }
    }else{
      return new Error('User not found'); 
    }

  }catch(err){
    console.log(err);
  }

})

app.get('/api/user', async (req, res) => {
  const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const id = decodedToken.id;
            
            if(id) {
              const client = await Client.findOne({where: {id}});
              const provider = await Provider.findOne({where: {id}});

              if(client) return res.status(200).json({ user: 'Client'});
              if(provider) return res.status(200).json({ user: 'Provider'});
            }
        } catch (err) {
            return res.json({ error: 'Invalid Token' });
        }
    } else {
        return res.json({ error: 'No token found' });
    }
});

app.get('/api/getToken', (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
      return res.status(401).json({ message: 'No token found' });
  }
  res.status(200).json({ token });
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

io.listen(4000);

app.post('/webhook/paymongo', async(req,res) =>{
  try {
    const data = req.body.data;

    if (data.attributes.type === 'payment.paid') {
        // Handle successful payment
        console.log("Payment was successful!");
        // Process the transaction or update your database here
    }

    res.sendStatus(200); // Respond to PayMongo to acknowledge receipt
} catch (error) {
    console.error("Error processing webhook:", error);
    res.sendStatus(500); // Respond with a 500 error if something goes wrong
}
})


const __dirname = path.resolve();

// Now you can use __dirname
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, ()=>{
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});

