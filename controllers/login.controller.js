const userModel = require("../models/user.model");
const emailActivity = require("./emailActivity.controller");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../config");
const requestIp = require("request-ip");
const CryptoJS = require("crypto-js");

// const login = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(200).send({
//         status: false,
//         msg: `${errors.errors[0].msg}`,
//       });
//     }

//     let checkEmail = await userModel.getUserEmail(req.body.email);
//     console.log(checkEmail);

//     if (checkEmail.length > 0) {
//       if (checkEmail[0].is_email_verify === 0) {
//         const Token = jwt.sign(
//           {
//             email: req.body.email,
//           },
//           config.JWT_SECRET_KEY
//         );

//         let headerMSG = `You're almost there!`;
//         let headerMSG1 = `crypto-wallet is delighted to have you on board ! <br/>To start exploring crypto-wallet, please confirm your Email address.`;
//         let mailmsg = `
//         <h2>Please <a href='${config.mailUrl}verifyAccount/${Token}'>click here </a> to activate your account</h2>`;

//         let mailMsg = emailActivity.Activity(
//           req.body.email,
//           "Account Activation Link",
//           headerMSG,
//           headerMSG1,
//           mailmsg
//         );

//         return res.status(200).send({
//           success: false,
//           msg: "We have Sent a mail, Please activate your account",
//         });
//       } else {
//         let hash = CryptoJS.SHA256(req.body.password).toString(
//           CryptoJS.enc.Hex
//         );
//         if (checkEmail[0].password !== hash) {
//           return res
//             .status(400)
//             .send({ status: false, msg: "password does not match" });
//         } else {
//           return res
//             .status(200)
//             .send({ status: true, msg: "login successfull ", token: Token });
//         }
//       }
//     } else {
//       return res
//         .status(400)
//         .send({ status: false, msg: "we dont have user with this email" });
//     }
//   } catch (err) {
//     return res.status(500).send({ status: false, error: err.message });
//   }
// };

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }

    let checkEmail = await userModel.getUserEmail(req.body.email);
    //console.log(checkEmail);
    const Token = jwt.sign(
      {
        email: req.body.email,
      },
      config.JWT_SECRET_KEY
    );
    if (checkEmail.length > 0) {
      if (checkEmail[0].is_email_verify === 0) {
        let headerMSG = `You're almost there!`;
        let headerMSG1 = `crypto-wallet is delighted to have you on board ! <br/>To start exploring crypto-wallet, please confirm your Email address.`;
        let mailmsg = `
          <h2>Please <a href='${config.mailUrl}verifyAccount/${Token}'>click here </a> to activate your account</h2>`;

        let mailMsg = emailActivity.Activity(
          req.body.email,
          "Account Activation Link",
          headerMSG,
          headerMSG1,
          mailmsg
        );

        return res.status(200).send({
          success: false,
          msg: "We have Sent a mail, Please activate your account",
        });
      } else {
        let hash = CryptoJS.SHA256(req.body.password).toString(
          CryptoJS.enc.Hex
        );
      

        if (checkEmail[0].password !== hash) {
          return res
            .status(400)
            .send({ status: false, msg: "password does not match" });
        }
        
          let check = await userModel.findBlock(req.body.email)
            if(Object.values(check[0])==1){
              return res.status(200).send({status:true , msg :"you cannot proceed further because you are blocked by admin"})
            }
            
        return res
            .status(200)
            .send({ status: true, msg: "login successfull ", token: Token ,data:checkEmail[0]});
        
      }
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "we dont have user with this email" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

// forget password

const forgetPassword = async (req, res) => {
  try {
    const checkEmail = await userModel.getUserEmail(req.body.email);
    console.log(checkEmail);
    if (checkEmail.length > 0) {
      const Token = jwt.sign(
        {
          email: req.body.email,
        },
        config.JWT_SECRET_KEY
      );
      let mailmsg = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
    <h4>Please <a href='${config.mailUrl}resetpassword/${Token}'>Click here </a> to Reset  your Password</h4>
    </div>`;
      let headerMSG = ``;
      let headerMSG1 = `crypto wallet exchange is delighted to have you  ! `;
      let mailMsg = emailActivity.Activity(
        req.body.email,
        "Reset Password Link",
        headerMSG,
        headerMSG1,
        mailmsg
      );
      if (mailmsg) {
        return res.status(200).send({
          status: true,
          msg: "please check your email for link to reset your password",
        });
      } else {
        return res.status(400).send({
          status: false,
          msg: "something went wrong please try again later",
        });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "email is not registered" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }
const hash1 = CryptoJS.SHA256(req.body.old_password).toString(CryptoJS.enc.Hex);
const checkPass= await userModel.checkPassword(req.body.email)
if(checkPass[0].password !==hash1){
  return res
            .status(400)
            .send({ status: false, msg: " old password does not match" });
}
const hash = CryptoJS.SHA256(req.body.password).toString(CryptoJS.enc.Hex);
// 091dc6098bb23546ae6656e7e7cc4b3a3c7523412c9bc6e4597c36d71215ee81
    const updatePass = await userModel.updatePassword(hash);
    console.log(updatePass);
    if (updatePass) {
      return res
        .status(201)
        .send({ status: true, msg: " password updated successfully" });
    } else {
      return res.status(400).send({
        status: false,
        msg: "something went wrong please try again later",
      });
    }
    //   }
    // );
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const verifyAccount = async (req, res) => {
  try {
    let token = req.body.token;
    if (token) {
      jwt.verify(
        token,
        config.JWT_SECRET_KEY,
        async function (err, decodedToken) {
          if (err) {
            return res
              .status(400)
              .send({ status: false, msg: "incorrect or expired link" });
          }
          const verify = await userModel.verifyAccount(decodedToken.email);
          if (verify) {
            let headerMSG = ``;
            let headerMSG1 = `crypto_wallet is delighted to have you  ! `;
            let mailmsg = `
                <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                <h4>Congratulation Your Account Have Been Successfully Verified</h4>
                </div>`;
            emailActivity.Activity(
              decodedToken.email,
              "Account Successfully Verified",
              headerMSG,
              headerMSG1,
              mailmsg
            );
            return res
              .status(200)
              .send({ status: true, msg: "account successfully verified" });
          } else {
            return res.status({ status: false, msg: "something went wrong" });
          }
        }
      );
    } else {
      return res
        .status(400)
        .send({ status: false, msg: " something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const ResetPassword = async (req, res) => {
  try {
    let token = req.body.token;
    jwt.verify(
      token,
      config.JWT_SECRET_KEY,
      async function (err, decodedToken) {
        if (err) {
          return res
            .status(400)
            .send({ status: false, msg: "Invalid token or expired link" });
        }
        let hash = CryptoJS.SHA256(req.body.password).toString(
          CryptoJS.enc.Hex
        );
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(200).send({
            status: false,
            msg: `${errors.errors[0].msg}`,
          });
        }
        const ResetPassword = await userModel.resetPassword(
          hash,
          decodedToken.email
        );
        if (ResetPassword) {
          return res
            .status(201)
            .send({ status: true, msg: "password reset successfull" });
        } else {
          return res
            .status(400)
            .send({
              status: false,
              msg: "something went wrong please try again later",
            });
        }
      }
    );
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { login, forgetPassword, changePassword, verifyAccount,ResetPassword };
