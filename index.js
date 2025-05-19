const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io'); // Import Socket.IO
const http = require('http'); // Import HTTP to create a server

// Import routes
const requestRoutes = require('./routes/requestRoute'); // Import the request routes
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const chatRoute = require('./routes/chatRoute');
const paymentRoute = require('./routes/paymentRoute'); // Import the payment route

dotenv.config()
const app = express();

// Create an HTTP server to work with both Express and Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ['https://reltv.netlify.app'], // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  },
});

// Middleware
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ['https://reltv.netlify.app/login'], // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB)
  .then(() =>
    server.listen(process.env.PORT,()=>console.log(`Server is running on port ${process.env.PORT}`))
  )
  .catch((error) => {});

// Routes
app.use('/auth', authRoute);
app.use('/chat', chatRoute);
app.use('/users', userRoute);
app.use('/posts', postRoute);
app.use('/request', requestRoutes);
app.use('/payment', paymentRoute); // Add the payment route

// Real-time chat functionality
const connectedUsers = {}; // Store connected users by their user IDs

const Chat = require('./model/ChatModel'); // Import the Chat model
const User = require('./model/userModel'); // Import the User model

io.on('connection', (socket) => {

  // Register the connected user
  socket.on('registerUser', (userId) => {
    connectedUsers[userId] = socket.id;
  });

  // Listen for messages
  socket.on('sendMessage', async (data) => {
    const { receiverId, chat } = data;

    try {
      // Find the chat between the two users
      let existingChat = await Chat.findOne({
        members: { $all: [chat.senderId, receiverId] },
      });

      if (!existingChat) {
        // If no chat exists, create a new one
        existingChat = new Chat({
          members: [chat.senderId, receiverId],
          chat: [chat],
        });
      } else {
        // Add the new message to the existing chat
        existingChat.chat.push(chat);
      }

      // Save the chat to the database
      await existingChat.save();

      // Send the message to the receiver if they are connected
      const receiverSocketId = connectedUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', chat);
      }
    } catch (error) {
      console.error('Error saving message to DB:', error);
    }
  });

  // Listen for location sharing
  socket.on('shareLocation', async (data) => {
    const { senderId, receiverId, location } = data;

    const senderSocketId = connectedUsers[senderId];
    const senderUsername = senderSocketId ? await User.findById(senderId).select('username') : 'Unknown';

    // Send the location to the receiver if they are connected
    const receiverSocketId = connectedUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveLocation', {
        senderId,
        location: { ...location, username: senderUsername.username },
      });
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {

    // Remove the disconnected user from the connected users list
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
  });
});
