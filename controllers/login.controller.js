const userModel = require('../models/user.model')
const emailActivity = require('./emailActivity.controller')
const {validationResult}=require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config')
const requestIp = require('request-ip');
const CryptoJS = require("crypto-js");


 const login = async (req, res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(200).send({
            status: false,
            msg: `${errors.errors[0].msg}`,
          });
        }

let checkEmail = await userModel.getUserEmail(req.body.email);
console.log(checkEmail)

if(checkEmail.length>0){
    if(checkEmail[0].is_email_verify ===0){
        return res.status(400).send({status: false , msg : "email not activated please activate it "})
    }
}
let hash = CryptoJS.SHA256(req.body.password).toString(CryptoJS.enc.Hex);
if(checkEmail[0].password !==hash){
    return res.status(400).send({status: false , msg : "password does not match"})
}else {
     return res.status(200).send({status : true , msg : "login successfull "})
}

    }catch(err){
        return res.status(500).send({status: false  , error : err.message})
    }
 }



// forget password 

const forgetPassword = async(req, res)=>{
    try{

    const checkEmail = await userModel.getUserEmail(req.body.email)
    console.log(checkEmail)
      if(checkEmail.length>0){
        const Token = jwt.sign({
            email: req.body.email
        }, config.JWT_SECRET_KEY)
    let mailmsg = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
    <h4>Please <a href='${config.mailUrl}resetpassword/${Token}'>Click here </a> to Reset  your Password</h4>
    </div>`
    let headerMSG=``
    let headerMSG1=`crypto wallet exchange is delighted to have you  ! `
    let mailMsg = emailActivity.Activity(req.body.email,'Reset Password Link', headerMSG,headerMSG1,mailmsg);
    if(mailmsg){
        return res.status(200).send({status:true , msg : "please check your email for link to reset your password"})
    }else{
         return res.status(400).send({status:false , msg : "something went wrong please try again later"})
    }
}else{
     return res.status(400).send({status: false , msg : "email is not registered"})
}
    }catch(err){
        return res.status(500).send({status:false , error: err.message})
    }
}


 module.exports={login, forgetPassword}