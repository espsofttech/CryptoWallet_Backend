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

class faqModel{

    insertDetails= async (data) => {
        let sql = `INSERT INTO FAQ(Questions,Answer)VALUES('${data.Questions}','${data.Answer}')`;
        const [result, fields] = await promisePool.query(sql);
         return result;
      };

      deleteDetails=async (id) => {
        let sql = `DELETE FROM FAQ WHERE id ='${id}'`;
        const [result, fields] = await promisePool.query(sql);
         return result;
      };

      updateDetails=async(data)=>{
        let sql = `UPDATE FAQ SET 
        Questions='${data.Questions}',
        Answer='${data.Answer}'`;
        const [result, fields] = await promisePool.query(sql);
         return result;
      }
        
      getDetails=async()=>{
        let sql = `SELECT * FROM FAQ`;
        const [result, fields] = await promisePool.query(sql);
        return result;
      }
      
      checkUserByid = async (id) => {
        let sql = `SELECT * FROM  FAQ WHERE id='${id}'`;
        const [result, fields] = await promisePool.query(sql);
    
        return result;
      };
}
module.exports=new faqModel()