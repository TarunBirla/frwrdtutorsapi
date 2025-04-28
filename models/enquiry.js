





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

// Ensure tables exist
async function ensureTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enquiry (
        id INT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS enquiry_errors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        enquiry_id INT,
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tables 'enquiry' and 'enquiry_errors' ensured.");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  }
}

ensureTables();
