var mysql=require('mysql');
require('dotenv').config()
var fs=require('fs');
// var con = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'Yuvraj1112#',
//     database : 'collaboratorDb',
// });

var con = mysql.createConnection({
    host     : process.env.host,
    port     : process.env.dbPort,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database,
    ssl: {ca: fs.readFileSync("./BaltimoreCyberTrustRoot.crt.pem")}
});
console.log(con);
module.exports={con};