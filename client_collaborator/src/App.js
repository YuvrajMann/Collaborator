import React,{useState,useEffect} from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RoomJoin from "./Components/RoomJoin/RoomJoin";
import LogOutOpts from "./Components/LogOut/LogOutOpts";
import Playground from "./Components/MainPlayground/MainPlayground";

const { io } = require("socket.io-client");
let socket;

function App() {
  let [socketId,setSocketId]=useState(null);

  useEffect(()=>{
    console.log('use effect');
    socket = io('http://localhost:8080',{
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttemps: 10,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false
    });
    setSocketId(socket);
  },[]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogOutOpts socket={socket}></LogOutOpts>}></Route>
        <Route path="/joinRoom" element={<RoomJoin  socket={socket}></RoomJoin>}></Route>
        <Route path="/playground" element={<Playground socket={socket}></Playground>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
