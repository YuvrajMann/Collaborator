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
import { useNavigate   } from "react-router-dom";

export default function MainPlayground(props) {
  const editorRef = useRef(null);
  const history = useNavigate();
  let [language, setLanguage] = useState(null);
  let [theme, setTheme] = useState("vs-dark");
  let [codeEditorVal,setCodeEditorVal]=useState('//Collaborator 🤝');
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current?.getValue());
  }
  useEffect(()=>{
    // console.log('emiting');
   
  },[codeEditorVal]);

  function onEditorChange(e){
    let location=window.location.href;
    let roomId=location.toString().split('/')[4];
    roomId=roomId.split('?')[0];
    let name=location.toString().split('?')[1];
    if(props.socket){
      props.socket.emit('newCode',e,roomId);  
    }
  }
  useEffect(()=>{
    if(props.socket){
      props.socket.on('newCodeChanges',(value,socketId,roomId)=>{
        // console.log(value,props.socket.id,socketId);
        if(props.socket.id.toString()!=socketId.toString()){
          setCodeEditorVal(value);
        }
      })
      props.socket.on('confirmNewRoom',(socketId,roomId,name)=>{
        // console.log(socketId,name);
        // console.log('joined the room');
        
        if(props.socket.id==socketId){
          // console.log('Got confirmation for joining room :',roomId);
         
        }
      });
      props.socket.on('newLanguage',(value,socketId,roomId)=>{
        if(props.socket.id.toString()!=socketId.toString()){
          setLanguage(value);
        }
      })
      props.socket.on('newTheme',(value,socketId,roomId)=>{
        if(props.socket.id.toString()!=socketId.toString()){
          setTheme(value);
        }
      })
      let location=window.location.href;
      let roomId=location.toString().split('/')[4];
      roomId=roomId.split('?')[0];
      let name=location.toString().split('?')[1];
      props.socket.emit('newRoomCreate',roomId,name);
      // console.log(roomId,name);
    }
  },props.socket);

  return (
    <div>
      <Header></Header>
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
            onChange={(e)=>{setCodeEditorVal(e);onEditorChange(e);}}
          />
        </div>
        <div className="right_view_area">
          <TextEditor socket={props.socket}></TextEditor>
        </div>
      </SplitPane>
    </div>
  );
}
