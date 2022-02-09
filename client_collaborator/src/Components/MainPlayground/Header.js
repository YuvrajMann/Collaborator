import React, { useState } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Drawer } from "antd";
import SendSvg from "../../assests/send4.svg";
import { Avatar, Divider } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";
import { HotKeys } from "react-hotkeys";

export default function Header(props) {
  const [visible, setVisible] = useState(false);
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

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className="my_top_header">
        <Drawer
          width={'620px'}
          title="Chat Room"
          placement="right"
          onClose={onClose}
          visible={visible}
        >
          <div className="chat_m_ara">
            <div></div>
            <div className="btm_ara">
              <input type="text" placeholder="Type a message"></input>
              <button>
                <img style={{ width: "20px" }} src={SendSvg}></img>
              </button>
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
            {
              (props.participats.map((participant)=>{
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
                )
              }))
            }
           
          </Avatar.Group>
          <div className="roomId_indicator">
            ROOM ID : {props.roomId}
          </div>
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
