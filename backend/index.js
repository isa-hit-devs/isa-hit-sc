require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const memberRoutes = require('./routes/memberRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

connectDB();

// 1. Strict CORS Configuration: Restrict API access to authorized frontend origins
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Access denied by CORS policy'));
      }
    },
    credentials: true,
  })
);

// 2. Rate Limiting: Prevent automated scraping and DDoS attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 mins
  message: { message: 'Too many requests from this IP, please try again later.' },
});

app.use('/api', apiLimiter);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('ISA Backend API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});