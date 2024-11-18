require("dotenv").config();
const express = require("express");
const app = express();
const port = 5500; // Use the PORT from Render, fallback to 5500 for local
const dbConnection = require("./db/dbConfig");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Authentication middleware
const authMiddleware = require("./middleWare/authMiddleWare");
// app.use("/api", authMiddleware);

// Answer routes middleware
const answerRoute = require("./routes/answerRoute");
app.use("/api/answers", authMiddleware, answerRoute);

// User routes middleware
const userRoute = require("./routes/userRoute");
app.use("/api/users", userRoute);

// Question routes middleware
const questionRoute = require("./routes/questionRoute");
app.use("/api/questions", authMiddleware, questionRoute);

async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`); // Log the correct port
      console.log("database connection established");
    });
  } catch (error) {
    console.log(error.message);
  }
}
start();
