let sids = new Map();
let rooms=new Map();

var collaboratorSocket=(socket,io)=>{
    let socketId=socket.id;
    socket.on('createorJoinRoom',(arg1,arg2)=>{
        console.log(arg1,arg2);
    });
    socket.emit('check','hell');
    socket.on("roomJoin",(roomId,name)=>{
        if(rooms[roomId]==null){
            //no such room
            socket.emit('roomNotExist',"Room doesn't exist");
        }
        else{
            //such room is there
            if(sids[socketId]==null){
                let roomSet=new Set();
                roomSet.add(roomId);
                sids[socketId]=roomSet;
            }
            else{
                sids[socketId].add(roomId);
            }
            
            if(rooms[roomId]==null){
                let roomSet=new Set();
                roomSet.add(socketId);
                rooms[roomId]=roomSet;
            }
            else{
                rooms[roomId].add(socketId);
            }
            socket.join(roomId.toString());
            console.log(io.sockets.adapter.rooms);
            io.to(roomId).emit('confirmNewRoom',socket.id,roomId,name);
        }
    });

    socket.on("newRoomCreate",(roomId,name)=>{
        //joining the room id
        if(sids[socketId]==null){
            let roomSet=new Set();
            roomSet.add(roomId);
            sids[socketId]=roomSet;
        }
        else{
            sids[socketId].add(roomId);
        }
        
        if(rooms[roomId]==null){
            let roomSet=new Set();
            roomSet.add(socketId);
            rooms[roomId]=roomSet;
        }
        else{
            rooms[roomId].add(socketId);
        }
        socket.join(roomId.toString());
        // console.log(io.sockets.adapter.rooms);
        io.to(roomId).emit('confirmNewRoom',socket.id,roomId,name);
    });     
}

module.exports={
    collaboratorSocket
}