let rooms = {};
var {chatSocket}=require('./chatSocket');
const { Client } = require('pg')

var collaboratorSocket = (socket, io) => {
  let socketId = socket.id;
  let currentRoomId = null;

  // chatSocket(socket,io,rooms,currentRoomId);
  socket.on('newMessage',(message,senderName,roomId)=>{
    console.log(message,roomId);
    io.to(roomId).emit("newMessage",message,senderName,socketId);
  })

  socket.on("createorJoinRoom", (arg1, arg2) => {
    console.log(arg1, arg2);
  });
  socket.emit("check", "hell");
  socket.on("roomJoin", (roomId, name) => {
    if (rooms.hasOwnProperty(roomId) == false) {
      //no such room
      socket.emit("roomNotExist", "Room doesn't exist");
    } else {
      //such room is there
      if (sids[socketId] == null) {
        let roomSet = new Set();
        roomSet.add(roomId);
        sids[socketId] = roomSet;
      } else {
        sids[socketId].add(roomId);
      }

      if (rooms[roomId] == null) {
        let roomSet = new Set();
        roomSet.add({ socketId, name });
        rooms[roomId] = roomSet;
      } else {
        rooms[roomId].add({ socketId, name });
      }
      socket.join(roomId.toString());
      console.log(sids, rooms);
      // console.log(io.sockets.adapter.rooms);
      io.to(roomId).emit("confirmNewRoom", socket.id, roomId, name);
    }
  });

  socket.on("checkRoomExistence",(roomId,name)=>{
    roomId=roomId.toString();
    if(!rooms.hasOwnProperty(roomId)){
      socket.emit('roomNotFound',roomId);
    }
    else{
      socket.emit('roomFound',roomId,name);
    }
  });

  socket.on("newRoomCreate", (roomId, name) => {
    //joining the room id
    if (rooms.hasOwnProperty(roomId) == false) {
      rooms[roomId] = [];
      rooms[roomId].push({ socketId, name });
    } else {
      rooms[roomId].push({ socketId, name });
    }
    currentRoomId = roomId;

    socket.join(roomId.toString());
    // console.log(io.sockets.adapter.rooms);
    let x = rooms[roomId];
    io.to(roomId).emit("confirmNewRoom", socket.id, roomId, name, x);
  });

  socket.on("newCode", (value, roomId) => {
    io.to(roomId).emit("newCodeChanges", value, socket.id, roomId);
  });
  socket.on("newLanguage", (value, roomId) => {
    console.log(value, roomId);

    io.to(roomId).emit("newLanguage", value, socket.id, roomId);
  });
  socket.on("newTheme", (value, roomId) => {
    console.log(value, "new theme");
    io.to(roomId).emit("newTheme", value, socket.id, roomId);
  });
  socket.on("newEditorState", (value, roomId) => {
    io.to(roomId).emit("newEditorState", value, socket.id, roomId);
  });
  socket.on("getRoomParticipant",(roomId)=>{
    let rms=rooms[roomId];
    io.to(roomId).emit("roomParticipants", rms, socket.id, roomId);
  });

  socket.on("disconnect", (reason) => {
    console.log(socket.id, currentRoomId);
    let members = rooms[currentRoomId];
    let name;
    if (members) {
      for (let i = 0; i < members.length; ++i) {
        let x = members[i];
        if (x.socketId.toString() == socket.id.toString()) {
          name = x.name;
          members.splice(i, 1);
          break;
        }
      }
    }
    io.to(currentRoomId).emit(
      "personDisconnected",
      socket.id,
      currentRoomId,
      members,
      name
    );
  });
};

module.exports = {
  collaboratorSocket,
};
