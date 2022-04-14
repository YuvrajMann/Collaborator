import React, { useState, Fragment } from "react";
import handshakes from "../../assests/handshake.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import "./Login.css";
import { Dialog, Transition } from "@headlessui/react";
import { Input, Button } from "antd";
// import { AxiosInstance } from "../";
import axios from 'axios';
import { axiosInstance } from "../../utils/axiosInterceptor.js";

export default function Login() {
    let [username, setUserName] = useState("");
    let [password, setPassword] = useState("");
    let [loading, setLoading] = useState(false);
    let [secretToken,setSecretToken]=useState("");

    let loginUser = () => {
        setLoading(true);
        axios.post('http://localhost:3000/users/signin', {
            username: username,
            password: password
        }).then((resp) => {
            // console.log(resp.data.secretToken);
            const newToken = resp.data.secretToken;
            // console.log(newToken);
            axiosInstance.interceptors.request.use((config) => {
                const auth = `Bearer ${newToken}`;
                config.headers.Authorization = `Bearer ${newToken}`;
                return config;
            });

            localStorage.setItem("token",resp.data.secretToken)
            message.success('Successfully logged IN!');
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            message.error('Invalid username or password');
            setLoading(false);
        })
    };

    return (
        <div className="login_wrapper">
            <div className="header_area">
                <img
                    style={{ width: "60px", marginRight: "10px" }}
                    src={handshakes}
                ></img>
                <div>COLLABORATOR </div>
            </div>
            <form className="main_wrap">
                <input className="intial_inputs" placeholder="username" value={username} onChange={(e) => {
                    setUserName(e.target.value);
                }}></input>
                <input type="password" className="intial_inputs" placeholder="password" value={password} onChange={(e) => {
                    setPassword(e.target.value);
                }}></input>
                <Button type="primary" block loading={loading} onClick={loginUser}>
                    Login
                </Button>
            </form>
            <div className="txt_m">
                Not Logged In? <a><Link to="/signUp">SignUp</Link></a>
            </div>
        </div>
    );
}
