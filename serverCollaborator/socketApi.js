const io = require( "socket.io" )();
const socketapi = {
    io: io
};
var {collaboratorSocket}=require('./collaboratorSocket');


// Add your socket.io logic here!
io.on("connection", (socket) => {
    console.log(socket.id);
    collaboratorSocket(socket,io);

    socket.on('createorJoinRoom',(roomId)=>{
        socket.join(roomId);
    });

});

// end of socket.io logic

module.exports = socketapi;
