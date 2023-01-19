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
}
module.exports = new supportModel();
