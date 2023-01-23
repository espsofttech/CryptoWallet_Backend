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
    let sql = `INSERT INTO transaction(user_id,coin_id,buyCoin_Id,type,amount,buyAmount)VALUES('${data.user_id}','${data.coin_id}','${data.buyCoin_Id}','${data.type}','${data.amount}','${data.buyAmount}')`;
    const [result, fields] = await promisePool.query(sql);
    
    return result;
  };

  getAllTransactionDetail=async()=>{
    let sql = `SELECT  transaction.user_id,transaction.coin_id,transaction.buyCoin_Id,transaction.type,transaction.amount,transaction.buyAmount,users.first_name ,coin.coinName , coins.coinName as buyCoinName from transaction
     LEFT JOIN users ON transaction.user_id=users.id
      LEFT JOIN coins  as coin ON  transaction.coin_id=coin.id 
      LEFT JOIN coins  ON transaction.buyCoin_Id = coins.id`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  }


}
module.exports = new transactionModel();
