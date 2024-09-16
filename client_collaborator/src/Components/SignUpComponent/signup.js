import React, { useState, Fragment } from "react";
import handshakes from "../../assests/handshake.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import "./signup.css";
import { Dialog, Transition } from "@headlessui/react";
import { Input, Button } from "antd";
import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';

export default function Login() {
  let [username, setUserName] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  let signUpHelper = (username, password) => {
    setLoading(true);
    console.log(username, password);
    axios({
      method: "post",
      url: "https://collaboratorbackend.azurewebsites.net/users/signUp",
      data: {
        username: username,
        password: password,
      },
    })
      .then((response) => {
        setLoading(false);
        console.log(response);
        message.success('Successfully Signed Up');
        navigation('/');
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error.response);
        if(error.response&&error.response.data){
          message.error(error.response.data);
        }
        else{
          message.error('Not able to signup');
        }
      });
  };
  return (
    <div className="login_wrapper">
      <div className="header_area">
        <img
          style={{ width: "60px", marginRight: "10px" }}
          src={handshakes}
        ></img>
        <div>COLLABORATOR</div>
      </div>
      <form className="main_wrap">
        <input
          className="intial_inputs"
          required
          placeholder="username"
          value={username}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        ></input>
        <input
         className="intial_inputs"
         required
         type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <Button
          loading={loading}
          type="primary"
          block
          onClick={() => {
            signUpHelper(username, password);
          }}
        >
          SignUp
        </Button>
      </form>
      <div className="txt_m">
        Not Logged In?{" "}
        <a>
          <Link to="/">SignIn</Link>
        </a>
      </div>
    </div>
  );
}
