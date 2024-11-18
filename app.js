require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5500;
const dbConnection = require("./db/dbConfig");
const cors = require('cors')
app.use(express.json());
app.use(cors())
// //Question routes middleware file

//auth middleware
const authMiddleware = require('./middleWare/authMiddleWare');  
// app.use("/api", authMiddleware);

const answerRoute = require("./routes/answerRoute");
app.use("/api/answers",authMiddleware, answerRoute);


//user routes middleware
const userRoute = require("./routes/userRoute");
app.use('/api/users',userRoute)


// //Question routes middleware

const questionRoute = require("./routes/questionRoute");

app.use("/api/questions",authMiddleware, questionRoute);


async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    app.listen(port);
    console.log("database connection established");
    console.log(`listening on port http://localhost:${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start()
