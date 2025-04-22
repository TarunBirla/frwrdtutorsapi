const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodeApi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;


pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        mobileNumber VARCHAR(15) NOT NULL,
        profileImage VARCHAR(255)
       
    )
`).then(() => {
    console.log("✅ 'users' table ensured.");
}).catch((err) => {
    console.error("❌ Error creating table:", err);
});




