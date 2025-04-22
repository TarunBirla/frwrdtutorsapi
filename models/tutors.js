





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
