const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const config = require("../config");
const cron = require("node-cron");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const pool = mysql.createPool({
  host: config.mysqlHost,
  user: config.user,
  password: process.env.DB_PASS || config.password,
  database: config.database,
  port: config.mysqlPort,
});
const promisePool = pool.promise();

// for uploading images in database
const multer = require("multer");
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    let filetype = "";
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpeg";
    }
    if (file.mimetype === "image/jpg") {
      filetype = "jpg";
    }
    if (file.mimetype === "video/mp4") {
      filetype = "mp4";
    }
    if (file.mimetype === "application/pdf") {
      filetype = "pdf";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
});
let upload = multer({ storage: storage });
let profileUpload = upload.fields([{ name: "image", maxCount: 1 }]);

//  test--------
router.get("/testme", function (req, res) {
  try {
    return res.send({ status: true, msg: "successfull" });
  } catch (err) {
    return res.send({ status: false, error: err.message });
  }
});


// controllers
const registercontroller = require("../controllers/register.controller");
const logincontroller = require("../controllers/login.controller");
const usercontroller = require("../controllers/user.controller");

// identity controller
const identitycontroller = require("../controllers/identity.controller");
// kyc controller
const kycController=require('../controllers/kycController')

// all schema
const {registerUserSchema,loginUserSchema,forgetPasswordSchema,changePasswordSchema} = require("../middleware/validators/userValidators.middleware");


router.post("/createUser",registerUserSchema,registercontroller.registerUser.bind());

router.post("/loginuser", loginUserSchema, logincontroller.login.bind());

//------------------------  forget password-------------------------
router.post("/forgetPassword",forgetPasswordSchema,logincontroller.forgetPassword.bind());
// ----------------------- reset password----------------------
router.post("/changePassword",ensureWebToken,changePasswordSchema,logincontroller.changePassword.bind());
//----------------------- verify account-------------------------

router.post("/verifyAccount", logincontroller.verifyAccount.bind());
//------------------------ resetPassword-------------------------

router.post("/resetPassword",changePasswordSchema,logincontroller.ResetPassword.bind());
// -------------------------update user-------------------------

router.put("/updateUser/:id",profileUpload,usercontroller.updateUserById.bind());
//------------------- get user by id--------------------------

router.get("/getUserDetailsById/:id", usercontroller.getUserDetailById.bind());
//  --------------------get all user--------------------------
router.get("/getAllUserDetails", usercontroller.getAllUsers.bind());


// insert data into identity model 

router.post("/insertIdentity",identitycontroller.insertIdentity.bind());

// update data in identity model 

router.put('/updateIdentity/:id',identitycontroller.updateIdentity.bind())

//  delete data from identity model
router.delete("/deleteData/:id" , identitycontroller.deleteIdentity.bind());

// get all list
router.get('/getAllIdentity',identitycontroller.getAllData.bind());
//   kyc apis

router.post('/InsertKycData',profileUpload,kycController.insertData.bind());

// get kyc by id

router.get('/getAllKycDetail',kycController.getAllkyc.bind());

// 
router.get('/getKycDetailById/:id',kycController.getKycById.bind())

// update kyc approval 

router.put('/successKyc/:id',kycController.UpdateSuccessKyc.bind())
// reject kyc approval

router.put('/rejectKyc/:id',kycController.rejectKyc.bind())






function ensureWebToken(req, res, next) {
  const x_access_token = req.headers["authorization"];
  if (typeof x_access_token !== undefined) {
    req.token = x_access_token;
    verifyJWT(req, res, next);
  } else {
    res.sendStatus(403);
  }
}
async function verifyJWT(req, res, next) {
  jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const _data = await jwt.decode(req.token, {
        complete: true,
        json: true,
      });
      req.user = _data["payload"];
      req.user_id = req.user.id;
      req.email = req.user.email;

      next();
    }
  });
}

module.exports.routes = router;
