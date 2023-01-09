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
  inserBankDetails = async (data, user_id) => {
    let sql = `INSERT INTO Bankdetail(user_id,bank_account_holder_name,branchName,AccountNumber,ifsc_code,panCardno,	accountType,GSTImage,cancelledChequeImage,	bankStatementImage)VALUES('${user_id}',
        '${data.bank_account_holder_name}','${data.branchName}','${data.AccountNumber}','${data.ifsc_code}','${data.panCardno}','${data.accountType}','${data.GSTImage}','${data.cancelledChequeImage}','${data.bankStatementImage}')`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };

  checkUserByid = async (user_id) => {
    let sql = `SELECT * FROM  Bankdetail WHERE user_id='${user_id}'`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };
  deleteDetails = async (user_id) => {
    let sql = `DELETE FROM  Bankdetail WHERE user_id='${user_id}'`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };

  getBankDetails = async (user_id) => {
    let sql = `SELECT Bankdetail.user_id,Bankdetail.bank_account_holder_name,
    Bankdetail.branchName,Bankdetail.AccountNumber,Bankdetail.ifsc_code,Bankdetail.panCardno,users.first_name FROM Bankdetail  LEFT JOIN users ON Bankdetail.user_id=users.id where user_id = '${user_id}'`;

    const [result, fields] = await promisePool.query(sql);

    return result;
  };
  getAllDetails = async () => {
    let sql = `SELECT Bankdetail.user_id,Bankdetail.bank_account_holder_name, Bankdetail.branchName,Bankdetail.AccountNumber,Bankdetail.ifsc_code,Bankdetail.panCardno,users.first_name FROM Bankdetail  LEFT JOIN users ON Bankdetail.user_id=users.id`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };
  updateDetails = async(data,user_id)=>{
    let sql = `UPDATE Bankdetail SET 
    user_id='${user_id}',
    bank_account_holder_name = '${data.bank_account_holder_name}',
    branchName='${data.branchName}',
    AccountNumber = '${data.AccountNumber}',
    ifsc_code ='${data.ifsc_code}',
    panCardno='${data.panCardno}',
    accountType='${data.accountType}',
    GSTImage='${data.GSTImage}',
    cancelledChequeImage='${data.cancelledChequeImage}',
    bankStatementImage='${data.bankStatementImage}'
    WHERE user_id='${user_id}'`
    const [result, fields] = await promisePool.query(sql);

    return result;
  }

}
module.exports = new bankModel();
