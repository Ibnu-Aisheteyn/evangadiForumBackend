// Load environment variables from .env file
require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5500; // Use Render's PORT or fallback to 5500 locally
const dbConnection = require("./db/dbConfig"); // Database connection
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Test route to confirm server is running
app.get("/", (req, res) => {
  res.send("Welcome to the Evangadi Forum server!");
});

// Authentication middleware
const authMiddleware = require("./middleWare/authMiddleWare");
app.use("/api", authMiddleware); // Enable middleware for /api routes

// Answer routes
const answerRoute = require("./routes/answerRoute");
app.use("/api/answers", answerRoute);

// User routes
const userRoute = require("./routes/userRoute");
app.use("/api/users", userRoute);

// Question routes
const questionRoute = require("./routes/questionRoute");
app.use("/api/questions", questionRoute);

// Start the server and establish the database connection
async function start() {
  try {
    const result = await dbConnection.execute("select 'test' "); // Test DB connection
    console.log("Database connection established");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

start();
