import React, { useRef, useState, useEffect } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faPaperPlane, faHome, faShare } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Drawer,Modal } from "antd";
import SendSvg from "../../assests/send4.svg";
import { Avatar, Divider } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";
import { HotKeys } from "react-hotkeys";
import moment from "moment";
import Linkify from 'react-linkify';
import RoomsViewButton from "./RoomsViewButton";
import { axiosInstance } from "../../utils/axiosInterceptor";
import { Spin } from 'antd';
import { Badge } from 'antd';
import audio from '../../assests/income.mp3'
import { useNavigate } from "react-router-dom";

export default function Header(props) {
  const [visible, setVisible] = useState(false);
  let [message, setMessage] = useState("");
  let [usrMessage, setUsrMessage] = useState("");
  let [allMessages, setAllMessages] = useState([]);
  let [usersUnderRoom, setUsersUnderRoom] = useState(null);
  let [usersLoading, setUsersLoading] = useState(false);
  let [unreadMessage, setUnreadMessage] = useState(false);
  let [shareDetailsVisible,setShareDetailsVisible]=useState(false);

  const history = useNavigate();

  let fetchUsersUnderRoom = (roomId) => {
    setUsersLoading(true);

    axiosInstance.post(`/rooms/getUsersUnderRoom`, {
      roomId: roomId
    }).then((resp) => {
      setUsersUnderRoom(resp.data.message);
      console.log(resp.data);
      setUsersLoading(false);
    })
      .catch((err) => {
        setUsersLoading(false);
      });
  }
  let playAudio = () => {
    new Audio(audio).play();
  }
  useEffect(() => {
    fetchUsersUnderRoom(props.roomDetails.id);
  }, []);
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
    useEffect(() => elementRef.current.scrollIntoView({}), [allMessages]);
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
          if (!visible) {
            setUnreadMessage(true);
          }
          else {
            setUnreadMessage(false);
          }
          playAudio();
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
      <Modal
        title="Share Details"
        visible={shareDetailsVisible}
        onCancel={()=>{
          setShareDetailsVisible(false);
        }}
        footer={null}
      >
        Ask the user to join the room with this id - <b><u>{props.roomDetails.room_id_assigned}</u></b>
      </Modal>
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
          <div id="mn_ara" ref={divRref}>
            {allMessages.map((mess) => {
              if (mess.side == -1) {
                return (
                  <div className="p_message">
                    <div className="message_leftSide">
                      <div className="mess_creator">{mess.name}</div>
                      <div><Linkify properties={{ target: '_blank', style: { color: 'red', fontWeight: 'bold' } }}>{mess.message}</Linkify></div>
                      <div className="mess_date">{mess.x}</div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="u_message">
                    <div className="message_rightSide">
                      <div className="mess_creator">{mess.name}</div>
                      <div><Linkify properties={{ target: '_blank', style: { color: 'red', fontWeight: 'bold' } }}>{mess.message}</Linkify></div>
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
          <Tooltip title="Home" placement="bottom">
            <div
              className="chat_icn_home"
              onClick={() => {
                history('/roomSelector');
                // setUnreadMessage(false);
                // showDrawer();
              }}
            >
              <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
            </div>
          </Tooltip>
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
                <Tooltip title={participant} placement="top">
                  <Avatar
                    style={{
                      backgroundColor: "#87d068",
                    }}
                  >
                    {participant.toString()[0]}
                  </Avatar>
                </Tooltip>
              );
            })}
          </Avatar.Group>
          <RoomsViewButton usersUnderRoom={usersUnderRoom} usersLoading={usersLoading}></RoomsViewButton>
          <div className="roomId_indicator">ROOM : {props.roomDetails.roomname}</div>
          <div className="editorStatus">{(props.changesSaved == 'saved') ? 'changes saved' : 'saving changes...'}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Tooltip placement="bottom" title="Share Room">
            <div
              className="chat_icn2"
              onClick={() => {
                setShareDetailsVisible(true);
              }}
            >
              <FontAwesomeIcon icon={faShare}></FontAwesomeIcon>
            </div>
          </Tooltip>
          <Tooltip placement="bottom" title="Chat">
            {
              unreadMessage ? (
                <Badge dot>
                  <div
                    className="chat_icn"
                    onClick={() => {
                      setUnreadMessage(false);
                      showDrawer();
                    }}
                  >
                    <FontAwesomeIcon icon={faCommentAlt}></FontAwesomeIcon>
                  </div>
                </Badge>

              ) : (
                <Badge>
                  <div
                    className="chat_icn"
                    onClick={() => {
                      setUnreadMessage(false);
                      showDrawer();
                    }}
                  >
                    <FontAwesomeIcon icon={faCommentAlt}></FontAwesomeIcon>
                  </div>
                </Badge>
              )
            }
          </Tooltip>
          <Tooltip placement="bottom" title={props.username}>
            <div style={{ backgroundColor: 'rgba(128, 128, 128, 0.139)', padding: '5px', marginLeft: '8px', borderRadius: '4px' }}>
              <Avatar
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fmdbootstrap.com%2Fdocs%2Fstandard%2Fextended%2Fprofiles%2F&psig=AOvVaw1XA_EpTtTOrgbqrWU__-U5&ust=1673286869529000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCJCVsL3FuPwCFQAAAAAdAAAAABAE"
                size={30}
                icon={<AntDesignOutlined />}
              />
            </div>
          </Tooltip>
        </div>


      </div>
    </HotKeys>
  );
}
