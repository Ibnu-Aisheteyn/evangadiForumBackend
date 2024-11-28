const mysql2 = require("mysql2");

// Create a connection pool for efficient handling of multiple connections
const dbConnection = mysql2.createPool({
  user: process.env.USER,
  database: process.env.DATABASE,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: process.env.PORT || 3306, // Ensure the port is used if provided in the .env file
  // dbUrl: process.env.DB_URL,
  // connectionLimit: process.env.CONNECTION_LIMIT || 10, // Optional: Default connection limit if not specified
});

module.exports = dbConnection.promise();
