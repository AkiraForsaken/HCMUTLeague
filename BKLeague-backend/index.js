const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');
const dotenv = require('dotenv').config();
const app = express();
const pool = require('./db');

app.use(cors()); // allow frontend to call backend
app.use(express.json());
app.set('db', pool);
app.use('/api/auth', authRoutes);

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
