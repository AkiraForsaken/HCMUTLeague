const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { Pool } = require('pg');
const setupDatabase = require('./db/setup');

const app = express();
app.use(express.json());
const corsOption = { origin: 'http://localhost:5173', credentials: true };
app.use(cors(corsOption)); // Allow React frontend on 5173

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((error) => {
  if (error) console.error('Database connection failed:', error);
  else console.log('Connected to PostgreSQL');
});

app.set('db', pool);
setupDatabase(pool);


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the My League API! Use /api endpoints to interact.' });
});
// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const teamsRouter = require('./routes/teams');
app.use('/api/teams', teamsRouter);
const stadiumRouter = require('./routes/stadiums');
app.use('/api/stadiums', stadiumRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));