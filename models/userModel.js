const config = require("../config");
const mysql = require("mysql2");
const { password } = require("../config");
const pool = mysql.createPool({
  host: config.mysqlHost,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.mysqlPort,
});

const promisePool = pool.promise();

class userModel {
  getUserEmail = async (email) => {
    let sql = `SELECT * FROM users where email ='${email}'`;
    console.log(sql); 
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  saveUserDetails = async (data) => {
    let sql = `INSERT INTO users (first_name , last_name , email, password,image,googleAuthCode,QR_code) VALUES ('${data.first_name}','${data.last_name}','${data.email}','${data.password}','${data.image}','${data.googleAuthCode}','${data.QR_code}')`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  updatePassword = async (hash, data) => {
    let sql = `UPDATE users SET password ='${hash}' WHERE email='${data}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  verifyAccount = async (email) => {
    let sql = `UPDATE users SET  is_email_verify = 1 WHERE email = '${email}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  resetPassword = async (hash, email) => {
    let sql = `UPDATE users SET password ='${hash}' WHERE email='${email}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  getAllDetail = async () => {
    let sql = `SELECT us.id,us.first_name,us.last_name,us.email,us.password,us.image,KYC.kyc_status,us.is_email_verify,us.is_Block,us.created_At,us.Description,us.is_admin,us.googleAuthCode,us.enableTwoFactor,us.QR_code,us.depositFiat,us.btc_address,us.eth_address,us.usdt_address,us.usdc_address,admin_bank.bank_name,au.crypto_address,au2.crypto_address as crypto_address2,au3.crypto_address as crypto_address3,au4.crypto_address as crypto_address4 FROM users AS us LEFT JOIN KYC ON us.id = KYC.user_id LEFT JOIN admin_bank ON us.depositFiat = admin_bank.id LEFT JOIN admin_bank as au ON us.btc_address = au.id LEFT JOIN admin_bank as au2 ON us.eth_address = au2.id LEFT JOIN admin_bank as au3 ON us.usdt_address = au3.id LEFT JOIN admin_bank as au4 ON us.usdc_address = au4.id ORDER BY id DESC`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  FindById = async (id) => {
    let sql = `SELECT * FROM users WHERE id='${id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  getUserById = async (id) => {
    let sql = `SELECT us.id,us.first_name,us.last_name,us.email,us.password,us.image,KYC.kyc_status,us.is_email_verify,us.is_Block,us.created_At,us.Description,us.is_admin,us.googleAuthCode,us.enableTwoFactor,us.QR_code,us.depositFiat,admin_bank.bank_name,au.crypto_address,au2.crypto_address as crypto_address2,au3.crypto_address as crypto_address3,au4.crypto_address as crypto_address4,us.btc_address,us.eth_address,us.usdt_address,us.usdc_address FROM users AS us LEFT JOIN KYC ON us.id = KYC.user_id LEFT JOIN admin_bank ON us.depositFiat = admin_bank.id LEFT JOIN admin_bank as au ON us.btc_address = au.id LEFT JOIN admin_bank as au2 ON us.eth_address = au2.id LEFT JOIN admin_bank as au3 ON us.usdt_address = au3.id  LEFT JOIN admin_bank as au4 ON us.usdc_address = au4.id WHERE us.id=${id} ORDER BY id DESC`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getUsersById = async (id) => {
    let sql = `SELECT us.id,us.first_name,us.last_name,us.email,us.password,us.image,KYC.kyc_status,us.is_email_verify,us.is_Block,us.created_At,us.Description,us.is_admin,us.googleAuthCode,us.enableTwoFactor,us.QR_code,us.depositFiat,admin_bank.bank_name,au.crypto_address,au2.crypto_address as crypto_address2,au3.crypto_address as crypto_address3,au4.crypto_address as crypto_address4,us.btc_address,us.eth_address,us.usdt_address,us.usdc_address FROM users AS us LEFT JOIN KYC ON us.id = KYC.user_id LEFT JOIN admin_bank ON us.depositFiat = admin_bank.id LEFT JOIN admin_bank as au ON us.btc_address = au.id LEFT JOIN admin_bank as au2 ON us.eth_address = au2.id LEFT JOIN admin_bank as au3 ON us.usdt_address = au3.id  LEFT JOIN admin_bank as au4 ON us.usdc_address = au4.id WHERE us.id=${id} ORDER BY id DESC`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  userUpdateById = async (data, id) => {
    let sql = `UPDATE users SET 
first_name = '${data.first_name}',
last_name='${data.last_name}',
image='${data.image}',
Description='${data.Description}'
WHERE id = '${id}'`;

    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  unblock = async (id) => {
    let sql = `UPDATE users SET is_Block =0 WHERE id ='${id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  blockUser = async (id) => {
    let sql = `UPDATE users SET is_Block =1 WHERE id ='${id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  findBlock = async (email) => {
    let sql = `SELECT is_Block FROM  users WHERE email = '${email}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  checkPassword = async (email) => {
    let sql = `SELECT * FROM  users WHERE email = '${email}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  getAllUsersList = async () => {
    let sql = `SELECT COUNT('id') FROM users`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  getUserOfToday = async () => {
    let sql = `SELECT COUNT('id')FROM users
     WHERE DATE(created_At) = CURDATE();`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  getTotalAmount = async () => {
    let sql = `SELECT SUM(balance) FROM depositFiat`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
}

module.exports = new userModel();
