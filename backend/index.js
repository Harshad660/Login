const express = require('express');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRoute');
require('dotenv').config();  // load .env

require('./Models/db'); // connect to DB

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // replaces body-parser

// ✅ Routes
app.get('/ping', (req, res) => {
  res.send('PONG');
});

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
