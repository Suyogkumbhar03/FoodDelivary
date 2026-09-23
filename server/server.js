import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/petpooja_food_db';

// Global Middleware with dynamic CORS origin resolution to prevent wildcard+credentials browser rejection
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, health checks)
    if (!origin) return callback(null, true);
    
    // If CLIENT_URL is specified, check allowed origin, otherwise echo requesting origin
    const clientUrl = process.env.CLIENT_URL;
    if (clientUrl && clientUrl !== '*') {
      const allowedOrigins = clientUrl.split(',').map(u => u.trim());
      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }
    }
    // Echo requesting origin dynamically so credentials: true is supported without wildcard '*' rejection
    return callback(null, origin);
  },
  credentials: true
}));
app.use(express.json());

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'PetPooja Indian Food Delivery Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * FRONTEND INTEGRATION GUIDELINES FOR STATUS CODES:
 * 
 * 1. HTTP 401 Unauthorized ({ error: 'AUTH_REQUIRED' }):
 *    - Triggered when a guest user tries to access protected endpoints (e.g. checkout, add address, my-orders).
 *    - Frontend Action: Intercept 401 response in Axios/Fetch interceptor, clear invalid token, 
 *      and open the Auth Modal / prompt user to log in or register.
 * 
 * 2. HTTP 403 Forbidden ({ error: 'ADDRESS_REQUIRED' }):
 *    - Triggered during order creation if req.user.hasCompletedAddress is false or addresses array is empty.
 *    - Frontend Action: Catch 403 response in order placement handler, open AddressModal automatically 
 *      with message: "Please enter your delivery address before proceeding to checkout."
 */

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Database Connection & Server Initialization
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Database (petpooja_food_db)');
    app.listen(PORT, () => {
      console.log(`🚀 PetPooja Backend API Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Failure:', err);
  });
