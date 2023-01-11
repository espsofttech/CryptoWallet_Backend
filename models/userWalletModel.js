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

class userWalletModel {
  insertCoinsDetails = async (data) => {
    let sql = `INSERT INTO userWallet (user_id,ethPrivateKey,ethPublicKey,btcPrivateKey,btcPublicKey) VALUES ('${data.user_id}','${data.ethPrivateKey}','${data.ethPublicKey}','${data.btcPrivateKey}','${data.btcPublicKey}')`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };
  checkDataById = async (user_id) => {
    let sql = `SELECT * FROM userWallet WHERE  user_id='${user_id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
}
module.exports = new userWalletModel();
