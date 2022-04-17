import React,{useState,useEffect} from "react";
import "./RoomJoin.css";
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons'
const { io } = require("socket.io-client");

export default function RoomJoin(props) {
  const [roomId,setRoomId]=useState(null);

  return (
    <div className="joinWrapper">
        <div className="backBtn"><Link to="/"><FontAwesomeIcon icon={faArrowCircleLeft}></FontAwesomeIcon></Link></div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if(roomId){
            props.socket.emit('createorJoinRoom',roomId);
          }
          else{
            alert('Enter the room Id');
          }
        }}
      >
        <div className="idInp">
          Enter the Room ID :<input type="text" onChange={(e)=>{
            setRoomId(e.target.value);
          }}></input>
        </div>
        <button type="submit">Join</button>
      </form>
    </div>
  );
}
