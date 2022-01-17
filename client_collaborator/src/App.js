import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RoomJoin from "./Components/RoomJoin/RoomJoin";
import LogOutOpts from "./Components/LogOut/LogOutOpts";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogOutOpts></LogOutOpts>}></Route>
        <Route path="/joinRoom" element={<RoomJoin></RoomJoin>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
