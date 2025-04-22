const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodeApi",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;

pool
  .query(
    `
    CREATE TABLE IF NOT EXISTS location (
       id INT PRIMARY KEY,
  name VARCHAR(255),
  town VARCHAR(255)    
    )
`
  )
  .then(() => {
    console.log("✅ 'location' table ensured.");
  })
  .catch((err) => {
    console.error("❌ Error creating table:", err);
  });
