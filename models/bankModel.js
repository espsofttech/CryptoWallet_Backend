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

 class bankModel {

    inserBankDetails=async(data,user_id)=>{
        let sql = `INSERT INTO Bankdetail(user_id,bank_account_holder_name,branchName,	AccountNumber,	ifsc_code,	panCardno)VALUES('${data.user_id}',
        '${data.bank_account_holder_name}','${data.branchName}','${data.AccountNumber}','${data.ifsc_code}','${data.panCardno}')WHERE id ='${user_id}'`;
        const [result, fields]=await promisePool.query(sql);
        console.log(result,sql)
        return result
    }


 }
 module.exports=new bankModel;