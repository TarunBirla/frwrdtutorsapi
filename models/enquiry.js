





const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodeApi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true // ← enables running multiple SQL queries at once
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
