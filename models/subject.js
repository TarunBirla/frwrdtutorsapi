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
