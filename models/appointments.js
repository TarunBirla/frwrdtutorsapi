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

pool
  .query(
    `
   CREATE TABLE IF NOT EXISTS appointment (
  id INT PRIMARY KEY,
  start DATETIME,
  finish DATETIME,
  units DECIMAL(5,2),
  topic VARCHAR(255),
  status VARCHAR(50),
  is_deleted BOOLEAN,
  location JSON,
  rcras JSON,
  cjas JSON,
  service JSON
);

`
  )
  .then(() => {
    console.log("✅ 'appointment' table ensured.");
  })
  .catch((err) => {
    console.error("❌ Error creating table:", err);
  });
