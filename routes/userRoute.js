const express = require("express");
const router = express.Router();
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { login, checkUser } = require("../Controller/usercontroller");
const authMiddleware = require("../middleWare/authMiddleWare");

// Register route
router.post("/register", register);

//login
router.post("/login", login);

//check user

router.get("/check", authMiddleware, checkUser);

// Controller
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!email || !password || !firstname || !lastname || !username) {
    console.log("here");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const [user] = await dbConnection.query(
      "SELECT username, userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (user && user.length > 0) {
      console.log("here2");

      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email or username already registered" });
    }

    // Check if the password length is valid
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Password must be at least 7 characters" });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "User created successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later" });
  }
}

// Export the router and controller functions
module.exports = router;
