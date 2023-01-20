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
  insertDetails = async (data) => {
    let sql = `INSERT INTO userWallet (user_id,coin_id,balance,privateKey,publicKey) VALUES ('${data.user_id}','${data.coin_id}','${data.balance}','${data.privateKey}','${data.publicKey}')`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  checkDataById = async (user_id, coin_id) => {
    let sql = `SELECT * FROM userWallet WHERE  user_id='${user_id}' and coin_id = '${coin_id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  checkDataById1 = async (user_id) => {
    let sql = `SELECT * FROM userWallet WHERE  user_id='${user_id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  updateUserWallet = async (data, user_id, coin_id) => {
    let sql = `UPDATE userWallet SET private_key='${data.private_key}', public_key='${data.public_key}' where user_id = ${user_id} and coin_id = ${coin_id}`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };
  updateBalance = async (balance, user_id) => {
    //  console.log(balance)
    let sql = `UPDATE userWallet SET balance='${balance}'where user_id='${user_id}'`;
    const [result, fields] = await promisePool.query(sql);
    //console.log(sql,result)
    return result;
  };

  updateBalancebyid = async (user_id, coin_id, amount) => {
    let sql = `UPDATE userWallet SET balance=(balance-${amount})where user_id='${user_id}' and coin_id ='${coin_id}'`;

    const [result, fields] = await promisePool.query(sql);
    console.log(sql, result);
    return result;
  };
  Balancebyid = async (user_id, coinId, buyamount) => {
    let sql = `UPDATE userWallet SET balance=(balance+${buyamount})where user_id='${user_id}' and coin_id ='${coinId}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  updateBalancebyid1 = async (user_id, coin_id, amount) => {
    let sql = `UPDATE userWallet SET balance=(balance+${amount})where user_id='${user_id}' and coin_id ='${coin_id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  Balancebyid1 = async (user_id, coinId, buyamount) => {
    let sql = `UPDATE userWallet SET balance=(balance-${buyamount})where user_id='${user_id}' and coin_id ='${coinId}'`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };

  checkBalance = async (data) => {
    let sql = `SELECT balance FROM userWallet WHERE user_id = '${data.user_id}'and coin_id ='${data.coin_id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  checkBalance1 = async (data) => {
    let sql = `SELECT balance FROM userWallet WHERE user_id = '${data.user_id}'and coin_id ='${data.coinId}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  withdraw = async (data) => {
    let sql = `UPDATE userWallet SET balance=(balance-${data.amount}) WHERE user_id ='${data.user_id}'and coin_id ='${data.coin_id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  getIdDetails = async (user_id) => {
    let sql = `SELECT * from userWallet  WHERE user_id ='${user_id}'`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };
}
module.exports = new userWalletModel();
