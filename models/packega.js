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
pool.query(`
    CREATE TABLE IF NOT EXISTS packega (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      numberofclass INT,
      description VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  .then(() => {
    console.log("✅ 'packega' table ensured.");
  })
  .catch((err) => {
    console.error("❌ Error creating table:", err);
  });
