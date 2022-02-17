import React, { useRef, useState, useEffect } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Drawer } from "antd";
import SendSvg from "../../assests/send4.svg";
import { Avatar, Divider } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";
import { HotKeys } from "react-hotkeys";
import moment from "moment";
import Linkify from 'react-linkify';

export default function Header(props) {
  const [visible, setVisible] = useState(false);
  let [message, setMessage] = useState("");
  let [usrMessage, setUsrMessage] = useState("");
  let [allMessages, setAllMessages] = useState([]);
  const divRref = useRef(null);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  const keyMap = {
    SNAP_LEFT: "ctrl+left",
    SNAP_RIGHT: "ctrl+right",
  };
  const handlers = {
    SNAP_LEFT: (e) => {
      showDrawer();
    },
    SNAP_RIGHT: (e) => {
      onClose();
    },
  };
  // let scrollDown=()=>{
  //   divRref.current.scrollTop = divRref.current.scrollHeight;
  //   // divRref.current.scrollIntoView({ behavior: 'smooth' });
  //   divRref.current.scrollOutV
  // }
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView({}),[allMessages]);
    return <div ref={elementRef} />;
  };
  useEffect(() => {
    if (props.socket) {
      props.socket.on("newMessage", (message, name, socketId) => {
        if (props.socket.id.toString() != socketId.toString()) {
          console.log(message, allMessages);
          let side = 1;
          console.log(allMessages);
          let d = new Date();
          let x = moment(d).format("hh:mm A");

          setAllMessages((prevMessages) => [
            ...prevMessages,
            { message, name, side, x },
          ]);
        }
      });
    }
  }, props.socket);

  let sendMessage = (message) => {
    let location = window.location.href;
    let name = location.toString().split("?")[1];
    let roomId = location.toString().split("/")[4];
    roomId = roomId.split("?")[0];
    let side = -1;
    let d = new Date();
    let x = moment(d).format("hh:mm A");

    setAllMessages((prevMessages) => [
      ...prevMessages,
      { message, name, side, x },
    ]);
    setMessage("");
    // scrollDown();
    props.socket.emit("newMessage", message, name, roomId);
    
  };

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className="my_top_header">
        <Drawer
          width={"620px"}
          title="Chat Room"
          placement="right"
          onClose={onClose}
          visible={visible}
          className="main_cnt"
          // style={{
          //   maxHeight:'10px'
          // }}
          // bodyStyle={{
          //   maxHeight:'calc(100% - 51px);'
          // }}
        >
          <div ref={divRref}>
            {allMessages.map((mess) => {
              if (mess.side == -1) {
                return (
                  <div className="p_message">
                    <div className="message_leftSide">
                    <div className="mess_creator">{mess.name}</div>
                      <div><Linkify properties={{target: '_blank', style: {color: 'red', fontWeight: 'bold'}}}>{mess.message}</Linkify></div>
                      <div className="mess_date">{mess.x}</div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="u_message">
                    <div className="message_rightSide">
                      <div className="mess_creator">{mess.name}</div>
                      <div><Linkify properties={{target: '_blank', style: {color: 'red', fontWeight: 'bold'}}}>{mess.message}</Linkify></div>
                      <div className="mess_date">{mess.x}</div>
                    </div>
                  </div>
                );
              }
            })}
            <AlwaysScrollToBottom></AlwaysScrollToBottom>
          </div>
          <div className="chat_m_ara">
            <div className="btm_ara">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (message != "") {
                    sendMessage(message);
                  }
                }}
              >
                <textarea
                  type="textarea"
                  placeholder="Type a message"
                  onChange={(e) => {
                    e.preventDefault();
                    setMessage(e.target.value);
                  }}
                  value={message}
                ></textarea>
                <button type="submit">
                  <img style={{ width: "20px" }} src={SendSvg}></img>
                </button>
              </form>
            </div>
          </div>
        </Drawer>
        <div className="header_left_area">
          <Avatar.Group
            maxCount={10}
            maxPopoverTrigger="click"
            size="large"
            maxStyle={{
              color: "#f56a00",
              backgroundColor: "#fde3cf",
              cursor: "pointer",
            }}
          >
            {props.participats.map((participant) => {
              return (
                <Tooltip title={participant.name} placement="top">
                  <Avatar
                    style={{
                      backgroundColor: "#87d068",
                    }}
                  >
                    {participant.name.toString()[0]}
                  </Avatar>
                </Tooltip>
              );
            })}
          </Avatar.Group>
          <div className="roomId_indicator">ROOM ID : {props.roomId}</div>
        </div>
        <Tooltip placement="bottom" title="Chat">
          <div
            className="chat_icn"
            onClick={() => {
              showDrawer();
            }}
          >
            <FontAwesomeIcon icon={faCommentAlt}></FontAwesomeIcon>
          </div>
        </Tooltip>
      </div>
    </HotKeys>
  );
}
