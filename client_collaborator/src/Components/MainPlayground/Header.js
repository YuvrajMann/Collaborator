import React, { useState } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Drawer } from "antd";

export default function Header() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="my_top_header">
      <Drawer
        width={620}
        title="Chat Room"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <div className="chat_m_ara">
          <div></div>
          <div className="btm_ara">
            <input type="text"></input>
            <button>
              <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </Drawer>
      <div>Avatars</div>
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
  );
}
