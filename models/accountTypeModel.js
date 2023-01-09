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

class accountTypeModel {

insertAccount =async(data)=>{
    let sql = `INSERT INTO  Account_Type(AccountName) VALUES('${data.AccountName}')`;
    const[result,fields]=await promisePool.query(sql);
    return result;
}
deleteAccount=async(id)=>{
  let sql = `DELETE FROM  Account_Type where id ='${id}'`;
  const[result,fields]=await promisePool.query(sql);
  return result;
}
checkId=async(id)=>{
  let sql = `SELECT * FROM  Account_Type where id ='${id}'`;
  const[result,fields]=await promisePool.query(sql);
  return result;

}
getAll =async()=>{
  let sql = `SELECT * FROM  Account_Type`;
  const[result,fields]=await promisePool.query(sql);
  return result;
}
}

module.exports=new accountTypeModel()