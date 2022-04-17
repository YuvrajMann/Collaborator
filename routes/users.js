var express = require("express");
var router = express.Router();
var DBController = require("../DBController");
var passwordValidator = require("password-validator");
var roomsController=require("../Controller/RoomsController");
var codeController=require("../Controller/CodeController");
var documentController=require("../Controller/DocumentsController");
var chatController=require("../Controller/chatsController");
var userRoomController=require("../Controller/userRoomController");
var jwt = require("jsonwebtoken");
var config=require("../config");
var authenticate=require('../authenticate');

var schema = new passwordValidator();
schema
  .is()
  .min(6)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(1)
  .has()
  .not()
  .spaces();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/signIn",(req,res,next)=>{
  let username = req.body.username;
  let password =req.body.password;

  let sql=`
    Select* From users where username='${username}' AND password=MD5('${password}');
  `
  DBController.con.query(sql, (err, result,fields) => {
    if (err){
      next(err);
    }
    if(result.length==0){
      var err = new Error("Username or password is invalid");
      next(err);
    }
    else{
      let token=jwt.sign({
        username:username,
        password:password
      }, config.secretKey, { expiresIn: 5184000 });
      res.status(200).send({message:"Successfully signed in",secretToken:token});
    }
    console.log(result);
  })
});
router.post("/signUp", (req, res, next) => {
  var sql = `
      CREATE TABLE IF NOT EXISTS users (username VARCHAR(255) NOT NULL UNIQUE
      , id INT NOT NULL AUTO_INCREMENT  PRIMARY KEY
      , password VARCHAR(255) NOT NULL);
    `;

  DBController.con.query(sql, (err, result) => {
    if (err) {
      next(err);
    } else {
      let username = req.body.username;
      let password = req.body.password;
      sql = `Insert Into users(username,password) VALUES('${username}',MD5('${password}'));`;
      DBController.con.query(sql, (err, result) => {
        if (err) {
          console.log(err.errno);
          if(err.errno.toString()=='1062'){
            res.status(500).send("Username already exist"); 
          }
          next(err);
        } else {
            res.status(200).send("Successfully signed Up");          
        }
      });
    }
  });
});
router.get('/getUserPrfileInfo',authenticate.verifyUser,(req,res,next)=>{
  let sql=`
    Select* From users where id='${res.locals.userId}';
  `
  DBController.con.query(sql, (err, result,fields) => {
    if (err){
      next(err);
    }
    res.status(200).send(result);  
  });
});
module.exports = router;
