import React,{useState,useEffect} from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RoomJoin from "./Components/RoomJoin/RoomJoin";
import LogOutOpts from "./Components/LogOut/LogOutOpts";
import Playground from "./Components/MainPlayground/MainPlayground";
import Login from "./Components/LoginComponent/Login.js";
import SignUp from "./Components/SignUpComponent/signup";
import RoomSelector from "./Components/RoomSelection/RoomSelector";
import { axiosInstance } from "./utils/axiosInterceptor";
import { useLayoutEffect } from "react";
const { io } = require("socket.io-client");
let socket;

function App() {
  let [socketId,setSocketId]=useState(null);
  let [isLoggedIn,setLoggedIn]=useState(false);

  useLayoutEffect(()=>{
    let token = localStorage.token;
    
    if (token) {
      axiosInstance.interceptors.request.use((config) => {
        token = localStorage.token;
        config.headers = Object.assign({
          Authorization: `Bearer ${token}`
        }, config.headers);
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
    }
  },[]);

  useEffect(()=>{
    console.log('use effect');
    socket = io('https://collaborator1.herokuapp.com/',{
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
        <Route path="/" element={<Login setLoggedIn={setLoggedIn}></Login>}></Route>
        <Route path="/signUp" element={<SignUp></SignUp>}></Route>
        {/* <Route path="/" element={<LogOutOpts socket={socket}></LogOutOpts>}></Route> */}
        <Route path="/joinRoom" element={<RoomJoin  socket={socket}></RoomJoin>}></Route>
        <Route path="/playground/:roomId" element={<Playground socket={socket}></Playground>}></Route>
        <Route path="/roomSelector" element={<RoomSelector></RoomSelector>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
