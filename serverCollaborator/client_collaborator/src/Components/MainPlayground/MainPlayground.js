import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import SplitPane from "react-split-pane";
import LeftPaneHead from "./LeftPaneHead";
import "./Resizer.css";
import ReactDOM from "react-dom";
import { DraftEditor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import TextEditor from "./TextEditor";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { axiosInstance } from "../../utils/axiosInterceptor";
import { Spin } from 'antd';

export default function MainPlayground(props) {
  const editorRef = useRef(null);
  const isCalledRef = React.useRef(false);

  const history = useNavigate();
  let [language, setLanguage] = useState(null);
  let [theme, setTheme] = useState("vs-dark");
  let [codeEditorVal, setCodeEditorVal] = useState('//Collaborator 🤝');
  let [roomParticipants, setParticipants] = useState([]);
  let [pageLoading, setPageLoading] = useState(false);
  let [personIsParticipantOfRoom, setPersonIsParticipantOfRoom] = useState(false);

  let location = window.location.href;
  let roomId = location.toString().split('/')[4];
  roomId = roomId.split('?')[0];
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    checkMemberParticipant();
  }, []);
  let checkMemberParticipant = () => {
    let roomId = location.toString().split('/')[4];
    roomId = roomId.split('?')[0];
    setPageLoading(true);

    axiosInstance.post('/rooms/checkIfPersonIsParticipantOfRoom', { roomId: roomId }).then((resp) => {
      console.log(resp);

      setPageLoading(false);
      if (resp.data == "YES") {
        setPersonIsParticipantOfRoom(true);
      }
      else {
        setPersonIsParticipantOfRoom(false);
      }
    })
      .catch((err) => {
        setPageLoading(false);
      })
  }
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current?.getValue());
  }
  useEffect(() => {
    // console.log('emiting');

  }, [codeEditorVal]);


  function onEditorChange(e) {
    let name = location.toString().split('?')[1];
    if (props.socket) {
      props.socket.emit('newCode', e, roomId);
    }
  }
  useEffect(() => {
    if (props.socket&&!isCalledRef.current) {
      isCalledRef.current = true;
      //new Person join a room
      props.socket.on('newCodeChanges', (value, socketId, roomId) => {
        // console.log(value,props.socket.id,socketId);
        if (props.socket.id.toString() != socketId.toString()) {
          setCodeEditorVal(value);
        }
      })
      props.socket.on('confirmNewRoom', (socketId, roomId, name, participats) => {
        // console.log(socketId,name);
        // console.log('joined the room');
        setParticipants(participats);

        if (props.socket.id == socketId) {
          // console.log('Got confirmation for joining room :',roomId);
          message.success(`Successfully joined the room with room id ${roomId}`);
        }
        else {
          message.success(`${name} joined the room`);
        }
      });

      props.socket.on('newLanguage', (value, socketId, roomId) => {
        if (props.socket.id.toString() != socketId.toString()) {
          setLanguage(value);
        }
      })
      props.socket.on('newTheme', (value, socketId, roomId) => {
        if (props.socket.id.toString() != socketId.toString()) {
          setTheme(value);
        }
      })
      props.socket.on('personDisconnected', (socketId, roomId, members, name) => {
        message.success(`${name} left the room`);
        setParticipants(members);
      });
      let location = window.location.href;
      let roomId = location.toString().split('/')[4];
      roomId = roomId.split('?')[0];
      let name = location.toString().split('?')[1];
      props.socket.emit('newRoomCreate', roomId, name);
      // console.log(roomId,name);
    }
  }, props.socket);


  return (
    <div>
      {
        pageLoading ? (
          <Spin></Spin>
        ) : (
          (personIsParticipantOfRoom) ? (
            <>
              <Header participats={roomParticipants} socket={props.socket} roomId={roomId}></Header>
              <SplitPane split="vertical" defaultSize={"50vw"}>
                <div className="left_area">
                  <LeftPaneHead
                    socket={props.socket}
                    language={language}
                    setLanguage={setLanguage}
                    theme={theme}
                    setTheme={setTheme}
                  ></LeftPaneHead>
                  <Editor
                    height="100vh"
                    defaultLanguage="javascript"
                    defaultValue="// some comment"
                    language={language}
                    theme={theme}
                    value={codeEditorVal}
                    onChange={(e) => { setCodeEditorVal(e); onEditorChange(e); }}
                  />
                </div>
                <div className="right_view_area">
                  <TextEditor socket={props.socket}></TextEditor>
                </div>
              </SplitPane>
            </>
          ) : (
            <div>
              Join The Room
            </div>
          )
        )
      }

    </div>
  );
}
