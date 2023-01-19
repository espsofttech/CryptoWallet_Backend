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

class transactionModel {
  insertDetails = async (data) => {
    let sql = `INSERT INTO transaction(user_id,coin_id,buyCoin_Id,type,amount)VALUES('${data.user_id}','${data.coin_id}','${data.buyCoin_Id}','${data.type}','${data.amount}')`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
}
module.exports = new transactionModel();
