const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const config = require('../config');
const cron = require('node-cron');
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: true
    })
);
const pool = mysql.createPool({ host: config.mysqlHost, user: config.user, password: process.env.DB_PASS || config.password, database: config.database, port: config.mysqlPort });
const promisePool = pool.promise();



router.get('/testme' , function(req, res){
    try{
    return res.send({status: true , msg : "successfull" })
    } catch(err){

        return res.send({status: false , error : err.message})
    }
})


const registercontroller = require('../controllers/register.controller')
const logincontroller = require('../controllers/login.controller')
const usercontroller = require('../controllers/user.controller')



const{registerUserSchema,loginUserSchema, forgetPasswordSchema,resetPasswordSchema}=require('../middleware/validators/userValidators.middleware');

router.post('/createUser',registerUserSchema,registercontroller.registerUser.bind());

router.post('/loginuser',loginUserSchema,logincontroller.login.bind());


//  forget password 
 router.post('/forgetPassword',forgetPasswordSchema,logincontroller.forgetPassword.bind());
//  reset password

router.post('/changePassword',ensureWebToken, resetPasswordSchema, logincontroller.resetPassword.bind())

function ensureWebToken(req, res, next) {
    const x_access_token = req.headers['authorization'];
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
                json: true
            });
            req.user = _data['payload'];
            req.user_id = req.user.id;
            req.email = req.user.email;
            // check if user is active or not 
            // let userDetails = await UserModel.getUsersDetails(req.user.email);
            // if (userDetails[0].is_active == 0) {
            //     return res.sendStatus(403);
            // } else {
                next();
            // }
        }
    })
}


module.exports.routes=router