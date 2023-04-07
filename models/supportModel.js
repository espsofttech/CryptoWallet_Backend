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

class supportModel {
  insertDetails = async (data) => {
    let sql = `INSERT INTO support(Name,email,phone,message,subject)VALUES('${data.Name}','${data.email}','${data.phone}','${data.message}','${data.subject}')`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  getDetails = async () => {
    let sql = `SELECT * FROM support`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  getAllsubscriberList = async () => {
    let sql = `SELECT COUNT('id') FROM support`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getAllTransactionList = async (user_id) => {
    let sql = `select * from (SELECT 1 as aid,
      sum(case when type=1 and buyCoin_Id=1 then amount else 0 end) as buyBTC,
        sum(case when type=1 and buyCoin_Id=2 then amount else 0 end) as buyETH,
        sum(case when type=1 and buyCoin_Id=3 then amount else 0 end) as buyUSDT,
        sum(case when type=1 and buyCoin_Id=4 then amount else 0 end) as buyUSDC,
        sum(case when type=2 and coin_id=1 then amount else 0 end) as sellBTC,
        sum(case when type=2 and coin_id=2 then amount else 0 end) as sellETH,
        sum(case when type=2 and coin_id=3 then amount else 0 end) as sellUSDT,
        sum(case when type=2 and coin_id=4 then amount else 0 end) as sellUSDC
    FROM transaction where user_id=${user_id} and type in (1,2)) as a 
    left join (select 1 as bid,b.* from (SELECT 
    user_id,
    sum(case when coin_id=1 then amount else 0 end) as withdrawBTC,
      sum(case when coin_id=2 then amount else 0 end) as withdrawETH,
      sum(case when coin_id=3 then amount else 0 end) as withdrawUSDT,
      sum(case when coin_id=4 then amount else 0 end) as withdrawUSDC,
      sum(case when coin_id=5 then amount else 0 end) as withdrawINR
  FROM withdrawList WHERE user_id=${user_id} and status=2)as b)as b on a.aid=b.bid
  
  left join (select 1 as cid,c.* from (SELECT 
    user_id,
      sum(case when coin_id=5 then balance else 0 end) as depositINR,
      sum(case when coin_id=6 then balance else 0 end) as depositAED,
      sum(case when coin_id=7 then balance else 0 end) as depositEURO,
      sum(case when coin_id=8 then balance else 0 end) as depositUSD
  FROM depositFiat WHERE user_id=${user_id} and status=1)as c)as c on a.aid=c.cid`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  }


}
module.exports = new supportModel();
