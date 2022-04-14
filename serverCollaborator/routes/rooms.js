var express = require("express");
var router = express.Router();

var roomsController = require("../Controller/RoomsController");
var userRoomController = require("../Controller/userRoomController");
var DBController = require("../DBController");

var authenticate = require("../authenticate");


router.get("/getRoomsUnderUser", authenticate.verifyUser, (req, res, next) => {
    let nsql = `
        Select* From Rooms 
        inner join usersRooms 
        ON usersRooms.room_id=Rooms.id 
        where user_id='${res.locals.userId}';
    `;

    DBController.con.query(nsql, (err, result) => {
        if(err){
            next(err);
        }   
        else{
            res.status(200).send({
                message: result
            });
        }     
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