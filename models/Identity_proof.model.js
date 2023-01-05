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

class IdentityModel {
  InsertIdentity = async (data) => {
    let sql = `INSERT INTO Identity_proof(Identity_name)VALUES('${data.Identity_name}')`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };


  updateIdentity = async (data, id) => {
    let sql = `UPDATE Identity_proof SET 
    Identity_name='${data.Identity_name}'WHERE id='${id}'`;

    const [result, fields] = await promisePool.query(sql);

    return result;
  };

  deleteIdentity = async(id)=>{
    let sql = `DELETE FROM  Identity_proof WHERE id='${id}'`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  }
  getAllData =async()=>{
    let sql = `SELECT * FROM Identity_proof`
    const [result, fields] = await promisePool.query(sql);

    return result;
  }
}

module.exports = new IdentityModel();
