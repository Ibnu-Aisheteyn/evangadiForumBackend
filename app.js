// Load environment variables from .env file
require("dotenv").config();
const express = require("express");
const app = express();

// Use the correct PORT variable and ensure it falls back to 5500 locally
const PORT = process.env.PORT || 5500; // Use the PORT from .env or default to 5500 for local development
const dbConnection = require("./db/dbConfig"); // Database connection
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Simple route to test server
app.get("/", (req, res) => {
  res.send("Welcome to the server!"); // Can be replaced with a more complex message or HTML
});

// Authentication middleware
const authMiddleware = require("./middleWare/authMiddleWare");
app.use("/api", authMiddleware); // Enabling the authMiddleware for all routes under /api

// Answer routes middleware
const answerRoute = require("./routes/answerRoute");
app.use("/api/answers", answerRoute);

// User routes middleware
const userRoute = require("./routes/userRoute");
app.use("/api/users", userRoute);

// Question routes middleware
const questionRoute = require("./routes/questionRoute");
app.use("/api/questions", questionRoute);

// Start the server and establish a database connection
async function start() {
  try {
    const result = await dbConnection.execute("select 'test' "); // Test DB connection
    app.listen(PORT, () => {
      // Use 'PORT' (uppercase) instead of 'port' (lowercase)
      console.log(`Server is running on port ${PORT}`); // Log the correct port number
      console.log("Database connection established");
    });
  } catch (error) {
    console.log(error.message); // Log any errors during the connection process
  }
}

start();
