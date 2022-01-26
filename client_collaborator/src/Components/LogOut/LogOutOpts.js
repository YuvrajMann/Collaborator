import React, { useEffect, useState } from "react";
import "./LogOutOpts.css";
import handshakes from "../../assests/handshake.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { nanoid } from 'nanoid'
import NewRoomModal from './NewRoomModal';
import RoomJoinModal from './RoomJoinModal';

export default function LogOutOpts(props) {
  let [loading,setLoading]=useState(false);
  let [newRoomModalOpen,setNewRoomModalOpen]=useState(false);
  let [joinRoomModalOpen,setJoinRoomModalOpen]=useState(false);

  useEffect(
    ()=>{
      if(props.socket){
      props.socket.on('check',(arg)=>{
        console.log(arg);
      })
      props.socket.on('confirmNewRoom',(socketId,roomId,name)=>{
        console.log(socketId,name);
        console.log('joined the room');
        
        if(props.socket.id==socketId){
          console.log('Got confirmation for joining room :',roomId);
          setLoading(false);
        }
      });
    }
    },[props.socket]
  );
  let newRoomJoin=(name)=>{
    let nanoId=nanoid(10);
    console.log(name);
    props.socket.emit('newRoomCreate',nanoId,name);
    setLoading(true);
  };

  let joinARoom=(name,roomId)=>{
    props.socket.emit('roomJoin',roomId,name);
  };

  return (
    <div className="logJoinNew">
      <NewRoomModal  newRoomJoin={newRoomJoin} newRoomModalOpen={newRoomModalOpen} setNewRoomModalOpen={setNewRoomModalOpen}></NewRoomModal>
      <RoomJoinModal joinARoom={joinARoom} joinRoomModalOpen={joinRoomModalOpen} setJoinRoomModalOpen={setJoinRoomModalOpen}></RoomJoinModal>
      <div className="header_area">
        <img
          style={{ width: "60px", marginRight: "10px" }}
          src={handshakes}
        ></img>
        <div>COLLABORATOR </div>
      </div>
      <div className="innerBlurArea">
        <div id="textarea">
            <button onClick={()=>{
             
              setJoinRoomModalOpen(true);
            }}>Join Room</button>     
          <button onClick={()=>{
            setNewRoomModalOpen(true);
            // newRoomJoin();
          }}>New Room</button>
        </div>
      </div>
    </div>
  );
}
