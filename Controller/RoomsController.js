var express = require("express");
var router = express.Router();
var DBController = require("../DBController");

let sql=`
    CREATE TABLE IF NOT EXISTS rooms (
        roomname VARCHAR(255) NOT NULL UNIQUE,
        room_image VARCHAR(255) NOT NULL,
        room_description VARCHAR(255),
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        room_id_assigned VARCHAR(255) NOT NULL,
        id INT NOT NULL AUTO_INCREMENT  PRIMARY KEY
    );
`

let fetchRoomsUnderUser=(user_id)=>{
    let nsql=`
        Select* From usersRooms where user_id='${user_id}';
    `
    console.log(user_id);
    
    let myPromise=new Promise((myResolve,myReject)=>{
        DBController.con.query(nsql,(err,result)=>{
            if (err) {
                myReject(err);
            } 
            else {
                myResolve(result)
            }
        });
    })
    return myPromise;
}
let createRoomTable=(roomname,room_image,room_description,room_id)=>{
        let myPromise = new Promise((myResolve, myReject)=>{
            DBController.con.query(sql, (err, result) => {
                if (err) {
                    myReject(err);
                } 
                else {
                    let insertSql=`
                        Insert Into rooms(roomname,room_image,room_description,room_id_assigned) VALUES('${roomname}','${room_image}','${room_description}','${room_id}');
                    `;
                    DBController.con.query(insertSql, (err, result) => {
                        if(err){
                            myReject(err);                            
                        }
                        else{
                            let sql=`
                            Select* From rooms where roomname='${roomname}';
                          `;
                            DBController.con.query(sql, (err, result,fields) => {
                                if (err){
                                    myReject(err); 
                                }
                                myResolve(result); 
                            })
                        }
                    })
                }
            }  
        );
    })
    return myPromise;
}


module.exports={
    createRoomTable,
    fetchRoomsUnderUser
};