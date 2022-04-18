var express = require("express");
var router = express.Router();

var roomsController = require("../Controller/RoomsController");
var userRoomController = require("../Controller/userRoomController");
var DBController = require("../DBController");
var codeController=require("../Controller/CodeController");
var docController=require("../Controller/DocumentsController");

var authenticate = require("../authenticate");

router.post("/getCodeForRoom",authenticate.verifyUser,(req,res,next)=>{
    let roomId = req.body.roomId;
    
    let nsql = `
        Select convert(current_blob USING utf8) AS code From codes
        where roomId='${roomId}';
    `;

    DBController.con.query(nsql, (err, result) => {
        if(err){
            next(err);
        }
        else{
            res.status(200).send(result);
        }
    })
});

router.post("/getDocsForRoom",authenticate.verifyUser,(req,res,next)=>{
    let roomId = req.body.roomId;
    
    let nsql = `
        Select convert(current_blob USING utf8) AS doc From document
        where roomId='${roomId}';
    `;

    DBController.con.query(nsql, (err, result) => {
        if(err){
            next(err);
        }
        else{
            res.status(200).send(result);
        }
    })
});

router.post("/saveDocChanges",authenticate.verifyUser,(req,res,next)=>{
    let roomId = req.body.roomId;
   
    let nsql = `
        Select* From document
        where roomId='${roomId}';
    `;

    DBController.con.query(nsql, (err, result) => {
        if(err){
            
            docController.createDocumentTable(req.body.blob,roomId).then((resp)=>{
                res.status(200).send('Successfully')
            })
            .catch((err)=>{
                next(err);
            })
        }
        else{
            if(result.length==0){
                docController.createDocumentTable(req.body.blob,roomId).then((resp)=>{
                    res.status(200).send('Successfully')
                })
                .catch((err)=>{
                    next(err);
                })
            }
            else{
                docController.alterDocTable(req.body.blob,roomId).then((resp)=>{
                    res.status(200).send('Successfully')
                })
                .catch((err)=>{
                    next(err);
                })
            }
        }
    })
});

router.post("/saveCodeChanges",authenticate.verifyUser,(req,res,next)=>{
    let roomId = req.body.roomId;
    
    let nsql = `
        Select* From codes
        where roomId='${roomId}';
    `;

    DBController.con.query(nsql, (err, result) => {
        if(err){
            codeController.createCodeTable(req.body.blob,roomId).then((resp)=>{
                res.status(200).send('Successfully')
            })
            .catch((err)=>{
                next(err);
            })
        }
        else{
            if(result.length==0){
                codeController.createCodeTable(req.body.blob,roomId).then((resp)=>{
                    res.status(200).send('Successfully')
                })
                .catch((err)=>{
                    next(err);
                })
            }
            else{
                codeController.alterCodeTable(req.body.blob,roomId).then((resp)=>{
                    res.status(200).send('Successfully')
                })
                .catch((err)=>{
                    next(err);
                })
            }
        }
    })
});
router.post("/checkIfPersonIsParticipantOfRoom", authenticate.verifyUser, (req, res, next) => {
    let roomId = req.body.roomId;

    let nsql = `
        Select* From Rooms
        where room_id_assigned='${roomId}';
    `;

    DBController.con.query(nsql, (err, result) => {
        if (err) {
            next(err);
        }
        else {
            console.log(result);
            let fsql = `
                Select* From Rooms 
                inner join usersRooms 
                ON usersRooms.room_id=Rooms.id 
                where user_id='${res.locals.userId}' AND room_id='${result[0].id}';
            `;
            DBController.con.query(fsql, (err, result1) => {
                if (err) {
                    next(err);
                }
                else {
                    if (result1.length == 0) {
                        res.status(200).send({ status: 'NO', roomDetails: result });
                    }
                    else {
                        res.status(200).send({ status: 'YES', roomDetails: result });
                    }
                }
            })
        }
    });
});
router.post("/getUsersUnderRoom",authenticate.verifyUser,(req,res,next)=>{
    let roomId = req.body.roomId;

    let nsql = `
        Select* From usersRooms
        inner join users
        on usersRooms.user_id=users.id
        where room_id=${roomId};
    `;

    DBController.con.query(nsql, (err, result) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).send({
                message: result
            });
        }
    })
});
router.get("/getRoomsUnderUser", authenticate.verifyUser, (req, res, next) => {
    let nsql = `
        Select* From Rooms 
        inner join usersRooms 
        ON usersRooms.room_id=Rooms.id 
        where user_id='${res.locals.userId}';
    `;

    DBController.con.query(nsql, (err, result) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).send({
                message: result
            });
        }
    })
});

router.post("/assignPersonToRoom", authenticate.verifyUser, (req, res, next) => {
    let roomId = req.body.roomId;

    userRoomController.createUserRoomTable(res.locals.userId, roomId).then((resp) => {
        res.status(200).send({
            message: "Successfully created a new room"
        });
    })
        .catch((err) => {
            next(err);
        })
});

router.post("/createAndAssignRoom", authenticate.verifyUser, (req, res, next) => {
    // console.log(res.locals.userId);
    let user = req.user;
    let roomname = req.body.roomname;
    let room_image = req.body.room_image;
    let room_description = req.body.room_description;
    let usr_idd = req.body.room_id;

    roomsController.createRoomTable(roomname, room_image, room_description, usr_idd).then((resp) => {
        // console.log(resp,'x2');
        let latestRoom = resp[0];

        userRoomController.createUserRoomTable(res.locals.userId, latestRoom.id).then((resp) => {
            res.status(200).send({
                message: "Successfully created a new room"
            });
        })
            .catch((err) => {
                next(err);
            });
    })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;