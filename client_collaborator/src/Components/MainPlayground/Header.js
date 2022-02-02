import React, { useState } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Drawer } from "antd";
import SendSvg from "../../assests/send4.svg";
import { Avatar, Divider } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";
import { HotKeys } from "react-hotkeys";

export default function Header() {
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
        <div>
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
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            <Avatar
              style={{
                backgroundColor: "#f56a00",
              }}
            >
              K
            </Avatar>
            <Tooltip title="Ant User" placement="top">
              <Avatar
                style={{
                  backgroundColor: "#87d068",
                }}
                icon={<UserOutlined />}
              />
            </Tooltip>
            <Avatar
              style={{
                backgroundColor: "#1890ff",
              }}
              icon={<AntDesignOutlined />}
            />

            <Avatar
              style={{
                backgroundColor: "#1890ff",
              }}
              icon={<AntDesignOutlined />}
            />
          </Avatar.Group>
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
