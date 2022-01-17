import React from "react";
import "./LogOutOpts.css";
import handshakes from "../../assests/handshake.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
export default function LogOutOpts() {
  return (
    <div className="logJoinNew">
      <div className="header_area">
        <img
          style={{ width: "60px", marginRight: "10px" }}
          src={handshakes}
        ></img>
        <div>COLLABORATOR </div>
      </div>
      <div className="innerBlurArea">
        <div id="textarea">
          <Link to="/joinRoom">
            <button>Join Room</button>
          </Link>
          <button>New Room</button>
        </div>
      </div>
    </div>
  );
}
