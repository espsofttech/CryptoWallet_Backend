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
  insertActivity = async (data) => {
    let sql = `INSERT INTO Activity (user_id,description) VALUES ('${data.user_id}','${data.description}')`;
    console.log(sql);
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
  updateBalance = async (previousbalance, balance, user_id, coin_id) => {
    //  console.log(balance)
    let sql = `UPDATE userWallet SET balance=${previousbalance + balance} where user_id='${user_id}' and coin_id='${coin_id}'`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };

  updateBalancebyid = async (user_id, coin_id, amount) => {
    let sql = `UPDATE userWallet SET balance=(balance-${amount})where user_id='${user_id}' and coin_id ='${coin_id}'`;
    console.log('sql1111', sql);
    const [result, fields] = await promisePool.query(sql);

    return result;
  };
  Balancebyid = async (user_id, coinId, buyamount) => {
    let sql = `UPDATE userWallet SET balance=(balance+${buyamount})where user_id='${user_id}' and coin_id ='${coinId}'`;
    console.log('sql1123', sql);
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  updateBalancebyid1 = async (user_id, coin_id, amount) => {
    let sql = `UPDATE userWallet SET balance=(balance-${amount})where user_id='${user_id}' and coin_id ='${coin_id}'`;
    const [result, fields] = await promisePool.query(sql);
    // console.log("222", sql)
    return result;
  };
  Balancebyid1 = async (user_id, coinId, buyamount) => {
    let sql = `UPDATE userWallet SET balance=(balance+${buyamount})where user_id='${user_id}' and coin_id ='${coinId}'`;
    const [result, fields] = await promisePool.query(sql);
    // console.log("111", sql)
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
    let sql = `UPDATE userWallet SET balance=(balance-${data.amount}) WHERE user_id ='${data.user_id}'and coin_id ='${data.coin_id}'`
    const [result, fields] = await promisePool.query(sql);
    return result;
  }
  getIdDetails = async (user_id) => {
    let sql = `SELECT uc.user_id,uc.coin_id,uc.balance,co.coinName from userWallet as uc LEFT JOIN coins as co on co.id = uc.coin_id WHERE user_id ='${user_id}'`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  }

  getcryptovalue = async (data) => {
    let sql = `SELECT * from Crypto_Value`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  updatelivecryptovalue = async (data) => {
    // console.log(data.bitcoin);ethereum tether usd_coin
    let sql = `UPDATE Crypto_Value SET crypto_val= ${data.bitcoin}, update_crypto_val = case when type= 0 then ${data.bitcoin} when type = 1 then (((percentage/100)*${data.bitcoin})+${data.bitcoin}) else (${data.bitcoin}-((percentage/100)*${data.bitcoin})) END WHERE id =1`;
    const [result, fields] = await promisePool.query(sql);
    let sql2 = `UPDATE Crypto_Value SET crypto_val= ${data.ethereum}, update_crypto_val = case when type= 0 then ${data.ethereum} when type = 1 then (((percentage/100)*${data.ethereum})+${data.ethereum}) else (${data.ethereum}-((percentage/100)*${data.ethereum})) END WHERE id =2`;
    const [result2, fields2] = await promisePool.query(sql2);

    let sql3 = `UPDATE Crypto_Value SET crypto_val= ${data.tether}, update_crypto_val = case when type= 0 then ${data.tether} when type = 1 then (((percentage/100)*${data.tether})+${data.tether}) else (${data.tether}-((percentage/100)*${data.tether})) END WHERE id =3`;
    const [result3, fields3] = await promisePool.query(sql3);

    let sql4 = `UPDATE Crypto_Value SET crypto_val= ${data.tether}, update_crypto_val = case when type= 0 then ${data.tether} when type = 1 then (((percentage/100)*${data.tether})+${data.tether}) else (${data.tether}-((percentage/100)*${data.tether})) END WHERE id =4`;
    const [result4, fields4] = await promisePool.query(sql4);


    return result4 ;
  };

  updatecryptovalue = async (data) => {
    console.log(data.bitcoin);
    let sql = `UPDATE Crypto_Value SET update_crypto_val= ${data.updatedValue} , percentage = ${data.percentage} , type= ${data.type} WHERE id =${data.id}`;
   
    const [result, fields4] = await promisePool.query(sql);


    return result ;
  };


}
module.exports = new userWalletModel();
