require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const reportsRouter = require('./routes/reports');

const app = express();
app.use(cors());
app.use(morgan('dev'));

app.use('/api', reportsRouter);

const PORT = process.env.PORT || 5000;

async function start() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/creditsea';
  
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB at', mongoUri);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('\n💡 Tips:');
    console.log('  1. Make sure MongoDB is running locally, or');
    console.log('  2. Set MONGO_URI in .env to use MongoDB Atlas');
    console.log('  3. Install MongoDB: brew install mongodb-community');
    console.log('  4. Start MongoDB: brew services start mongodb-community\n');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
  });
}

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = app;
