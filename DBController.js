var mysql=require('mysql');

var con = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Yuvraj1112#',
    database : 'collaboratorDb',
});

module.exports={con};