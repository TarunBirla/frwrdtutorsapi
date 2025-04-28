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
 CREATE TABLE IF NOT EXISTS student (
  studentid INT PRIMARY KEY,
  studentfirstname VARCHAR(255),
  studentlastname VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  mobile VARCHAR(255),
  phone VARCHAR(255),
  clientid INT,
  clientfirstname VARCHAR(255),
  clientlastname VARCHAR(255)
);

`
  )
  .then(() => {
    console.log("✅ 'student' table ensured.");
  })
  .catch((err) => {
    console.error("❌ Error creating table:", err);
  });
