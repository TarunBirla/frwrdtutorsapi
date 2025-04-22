const express = require("express");
const mysql = require("mysql2");
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodeApi'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// Make connection globally available if needed
global.db = connection;

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to MySQL live server - FRWRD-Tutors Project 🚀");
});

app.use('/api', authRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Error Handler
app.use(errorHandler);

module.exports = app;
