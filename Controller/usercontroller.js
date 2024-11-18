//db connection
const dbConnection = require("../db/dbConfig");

const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// login user
async function login(req,res){
  const {email,password} = req.body
  if(!email || !password){
      return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide all fields"})
}
  try{
      const [user] = await dbConnection.query("select username,userid,password from users where email = ?",[email])
      // return res.json({user:user[0]})
      if (user.length == 0){
          return res.status(StatusCodes.BAD_REQUEST).json({msg:"please signup first "})
      }
      //compare password 
      const isMatch = await bcrypt.compare(password,user[0].password)
      if(!isMatch){
          return res.status(StatusCodes.BAD_REQUEST).json({msg:"invalid credentials"})
      }
      // return res.status(StatusCodes.OK).json({msg:"login success"})
      // return res.json({user})
      const username = user[0].username
      const userid = user[0].userid
      const token =jwt.sign({username,userid},process.env.JWT_SECRET,{expiresIn:"1h"})

      return res.status(StatusCodes.OK).json({msg:"login success",token,username,userid})

  }

  catch(err){ 
      console.log(err.message)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"server error"})
}

}
//  check user
async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  res.status(StatusCodes.OK).json({ message: "valid user", username, userid });
}

module.exports = { login, checkUser };
