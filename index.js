import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.routes.js';
import CheckRouter from './routes/availability.routes.js';
import path from 'path'; // Ensure path is imported
import paymentRoutes from './routes/payment.route.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'https://clientrentcapture.netlify.app', // Corrected the origin (removed trailing '/')
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Using CORS options for all routes

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDB!");
  })
  .catch((err) => {
    console.log("Error:" + err);
  });

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/check', CheckRouter);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin',adminRoutes)

// Serve static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/dist')));

// Catch-all route to handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}!`);
});
