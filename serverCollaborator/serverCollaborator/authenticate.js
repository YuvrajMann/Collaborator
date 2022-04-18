var jwt = require('jsonwebtoken');
var config=require('./config');
var DBController = require("./DBController");

let verifyUser=(req,res,next)=>{
    var token;
    
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token=req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        token=req.query.token;
    }
    console.log(token);
    var decoded = jwt.verify(token, config.secretKey,(err,decoded)=>{
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        console.log(decoded);
        let sql=`
            Select* From users where username='${decoded.username}' AND password=MD5('${decoded.password}');
        `
        DBController.con.query(sql, (err, result,fields) => {
            if (err){
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            }
            res.locals.userId=result[0].id;
            next();
        });
    })
}
module.exports={verifyUser}