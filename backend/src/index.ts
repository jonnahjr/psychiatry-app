import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patient.routes';
import doctorRoutes from './routes/doctor.routes';
import adminRoutes from './routes/admin.routes';
import appointmentRoutes from './routes/appointment.routes';
import chatRoutes from './routes/chat.routes';
import paymentRoutes from './routes/payment.routes';
import videoRoutes from './routes/video.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';

// Import database connection
import { testConnection } from './config/supabase';

// Import models for socket handling
import Message from './models/Message';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL || 'http://localhost:3000'
      : "*", // Allow all origins in development for mobile app access
    methods: ['GET', 'POST'],
  },
});

// Connect to database
testConnection();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL || 'http://localhost:3000'
    : "*", // Allow all origins in development for mobile app access
  credentials: true,
}));
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/video', videoRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Tele-Psychiatry API is running',
    timestamp: new Date().toISOString(),
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join appointment room for chat and video
  socket.on('join-appointment', (appointmentId) => {
    socket.join(`appointment-${appointmentId}`);
    console.log(`User ${socket.id} joined appointment ${appointmentId}`);
  });

  // Handle chat messages
  socket.on('send-message', async (data) => {
    try {
      const { appointmentId, content, messageType, fileUrl, fileName } = data;

      // Validate required fields
      if (!appointmentId || !content) {
        socket.emit('message-error', { error: 'Appointment ID and content are required' });
        return;
      }

      // Save message to database (you might want to add authentication here)
      const message = new Message({
        sender: data.senderId,
        receiver: data.receiverId,
        appointment: appointmentId,
        content,
        messageType: messageType || 'text',
        fileUrl,
        fileName,
      });

      await message.save();
      await message.populate('sender', 'name email role');

      // Emit to all users in the appointment room
      io.to(`appointment-${appointmentId}`).emit('receive-message', {
        ...message.toObject(),
        isFromSocket: true,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message-error', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    socket.to(`appointment-${data.appointmentId}`).emit('user-typing', {
      userId: data.userId,
      userName: data.userName,
    });
  });

  socket.on('typing-stop', (data) => {
    socket.to(`appointment-${data.appointmentId}`).emit('user-stop-typing', {
      userId: data.userId,
    });
  });

  // Handle video call signaling
  socket.on('video-offer', (data) => {
    socket.to(`appointment-${data.appointmentId}`).emit('video-offer', {
      offer: data.offer,
      from: socket.id,
    });
  });

  socket.on('video-answer', (data) => {
    socket.to(`appointment-${data.appointmentId}`).emit('video-answer', {
      answer: data.answer,
      from: socket.id,
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(`appointment-${data.appointmentId}`).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.id,
    });
  });

  socket.on('end-call', (data) => {
    socket.to(`appointment-${data.appointmentId}`).emit('call-ended', {
      from: socket.id,
    });
  });

  // Handle appointment status updates
  socket.on('appointment-update', (data) => {
    socket.to(`appointment-${data.appointmentId}`).emit('appointment-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all interfaces for mobile access
server.listen(Number(PORT), HOST, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${HOST}:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

export default app;