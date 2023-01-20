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

class coinsModel {
  insertCoinsDetails = async (data) => {
    let sql = `INSERT INTO coins (ethPrivateKey,ethPublicKey,btcPrivateKey,btcPublicKey) VALUES ('${data.ethPrivateKey}','${data.ethPublicKey}','${data.btcPrivateKey}','${data.btcPublicKey}')`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };
  getCoinsDetails = async () => {
    let sql = `SELECT * FROM coins`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };

  checkInr=async(coin_id)=>{
    let sql =`SELECT coinName FROM coins WHERE  id='${coin_id}'`;
    const [result, fields] = await promisePool.query(sql);
    // console.log(sql , result)
    return result;
  }
}
module.exports = new coinsModel();
