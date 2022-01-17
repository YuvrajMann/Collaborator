import React from "react";
import "./RoomJoin.css";
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons'

export default function RoomJoin() {
  return (
    <div className="joinWrapper">
        <div className="backBtn"><Link to="/"><FontAwesomeIcon icon={faArrowCircleLeft}></FontAwesomeIcon></Link></div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="idInp">
          Enter the Room ID :<input type="text"></input>
        </div>
        <button type="submit">Join</button>
      </form>
    </div>
  );
}
