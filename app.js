const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
const assert = require('assert')
const config = require('./config')
var cron = require('node-cron')
const mysql = require('mysql2')
//   const Transfer = require('./controllers')
const CryptoJS = require('crypto-js')
const { routes } = require('./routes/routes');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


const pool = mysql.createPool({
    host: config.mysqlHost, user: config.user, password: config.password, database: config.database, port: config.mysqlPort
});
const promisePool = pool.promise();

//    load config 
const stage = process.env.NODE_ENV || 'production';
const env = dotenv.config({
    path: `${stage}.env`
})
assert.equal(null, env.error);
app.set('env', stage);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cors());

app.get("/", function (req, res) {
    res.send("node is running")
})

app.use('/', routes)

if (module === require.main) {
    var Server = app.listen(process.env.PORT || 8080, function () {
        var port = Server.address().port;
        console.log("App listening on port %s", port)
    })
}