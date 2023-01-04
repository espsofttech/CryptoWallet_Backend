const config = require('../config')
const mysql= require('mysql2');
const { password } = require('../config');
const pool = mysql.createPool({host:config.mysqlHost, user:config.user, password:config.password,database:config.database , port:config.mysqlPort });

const promisePool= pool.promise();
 
class userModel {
   
    getUserEmail = async(email)=>{
        let sql = `SELECT * FROM users where email ='${email}'`;
        const[result , fields] = await promisePool.query(sql);
        return result;
    }


     saveUserDetails = async ( data)=>{
        let sql = `INSERT INTO users (first_name , last_name , email, password, referral_code , image) VALUES ('${data.first_name}','${data.last_name}','${data.email}','${data.password}','${data.referral_code}','${data.image}')`;
        const [result , fields]= await promisePool.query(sql)
        return result;
     }

     updatePassword = async (data)=>{
        let sql = `UPDATE users SET password ='${password}' WHERE email='${data.email}'`;
        const [ result , fields]=await promisePool.query(sql)
        return result;
     }

 }


 module.exports= new userModel