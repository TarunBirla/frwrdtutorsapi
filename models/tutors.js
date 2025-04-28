





const mysql = require("mysql2/promise");
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  queueLimit: 0,
});

module.exports = pool;

async function createTutorsTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tutors (
        id INT PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        photo TEXT,
        qualifications TEXT,
        subject TEXT,
        town VARCHAR(255),
        country VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    try {
      await pool.query(createTableQuery);
      console.log("✅ 'tutors' table ensured.");
    } catch (err) {
      console.error("❌ Error creating 'tutors' table:", err);
    }
  }
  
  createTutorsTable();
