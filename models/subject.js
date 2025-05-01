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

pool.query(
    `
    CREATE TABLE IF NOT EXISTS subjectAll (
       id INT PRIMARY KEY,
  name VARCHAR(255),
  category_id INT,
  category_name VARCHAR(255),
  custom_to_branch VARCHAR(255) DEFAULT NULL
       
    )
`
  )
  .then(() => {
    console.log("✅ 'subjecttable' table ensured.");
  })
  .catch((err) => {
    console.error("❌ Error creating table:", err);
  });
