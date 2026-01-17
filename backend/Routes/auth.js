const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser')

const JWT_tokens="VishalHello";

const { body, validationResult } = require("express-validator");

//ROUTE 1:Create user using POST "/api/auth/createuser" no login required

router.post(
  "/createuser",
  [
    body("name", "Enter the valid name").isLength({ min: 3 }),
    body("email", "Enter the valid email").isEmail(),
    body("password", "Password must be atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //If there is error returns bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check whether the user with this email exist already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user with this email already exist" });
      }
      const salt=await bcrypt.genSalt(10);
      const secPass=await bcrypt.hash(req.body.password,salt);

      
      //Create new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      //.then(user=>res.json(user))
      // .catch(err=>{console.log(err)
      //     res.json({error:"please enter the unique email id"})
      // });

      // console.log(req.body);
      // const user=User(req.body);
      // user.save();

      const data={
        user:{
            id:user.id
        }
      }
      const authtoken=jwt.sign(data,JWT_tokens);
    //   console.log(jwtdata);
      res.json(authtoken);




    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
//ROUTE 2:auhenticating user using POST "/api/auth/login" no login required

router.post(
  "/login",
  [
    body("email", "Enter the valid email").isEmail(),
    body("password", "password cannot be empty").exists(),
    
  ],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try {
        let user=await User.findOne({email});
        if (!user) {
      return res.status(400).json({ errors: "please try to login with the correct credentials" });
    }
    const passwordcompare=await bcrypt.compare(password,user.password);
     if (!passwordcompare) {
      let success=flase;

      return res.status(400).json({success, errors: "please try to login with the correct credentials" });
    }
    const data={
        user:{
            id:user.id
        }
      }
      const authtoken=jwt.sign(data,JWT_tokens);
      let success=true;
      res.json({success,authtoken});
        
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }

  }
)

//ROUTE 3:GET LOGGED IN user details using POST "/api/auth/getuser" login required

router.post(
  "/getuser",fetchuser,
 async (req, res) => {

try {
    const userid=req.user.id;
    const user=await User.findById(userid).select('-password')
    res.send(user);
    
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
}
  });
module.exports = router;
