import React, { useEffect, useState } from "react";
import "./LogOutOpts.css";
import handshakes from "../../assests/handshake.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { nanoid } from 'nanoid'
import NewRoomModal from './NewRoomModal';
import RoomJoinModal from './RoomJoinModal';
import { useNavigate   } from "react-router-dom";
import {message} from 'antd';

export default function LogOutOpts(props) {
  const history = useNavigate();
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
      props.socket.on('roomNotFound',(roomId)=>{
        message.warn(`Room with ID ${roomId} doesn't exist`)
      });
      props.socket.on('roomFound',(roomId,name)=>{
        history(`/playground/${roomId}?${name}`);
        setLoading(true);        
      });
    }
    },[props.socket]
  );
  let usernameRegex=(name)=>{
      let pattern=/^\S*$/;
      return pattern.test(name);
  }
  let newRoomJoin=(name)=>{
    if(usernameRegex(name)){     
      let nanoId=nanoid(10);
      console.log(name);
      history(`/playground/${nanoId}?${name}`);
      // props.socket.emit('newRoomCreate',nanoId,name);
      setLoading(true);  
    }
    else{
      message.warning('Invalid username , must not contain spaces');
    }
  };

  let joinARoom=(name,roomId)=>{
    if(usernameRegex(name)){     
      props.socket.emit('checkRoomExistence',roomId,name);
    }
    else{
      message.warning('Invalid username , must not contain spaces');
    }
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
