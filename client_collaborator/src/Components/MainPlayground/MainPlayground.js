import React, { useEffect, useRef, useState,useCallback } from "react";
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
import Ellipse from '../../assests/ellipse.svg';
import { AntDesignOutlined } from '@ant-design/icons'
import { Avatar } from 'antd';
import handshakes from "../../assests/handshake.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Drawer } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import audio from '../../assests/income.mp3';
import { debounce } from "lodash";

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
  let [notSignedIn, setNotSignedIn] = useState(true);
  let [roomDetails, setRoomDetails] = useState(null);
  let [drawerOpen, setDrawerOpen] = useState(false);
  let [profileLoading, setProfileLoading] = useState(false);
  let [roomsUnderUser, setRoomUnderUser] = useState(null);
  let [username, setUserName] = useState(null);
  let [joinBtnLoading,setJoinBtnLoading]=useState()
  let [changesSaved,setChangesSaved]=useState('saved');

  let location = window.location.href;
  let roomId = location.toString().split('/')[4];
  let dbRoomId=null;
  let codeValueDebounce='';

  roomId = roomId.split('?')[0];
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
 
  let getProfile = () => {
    setProfileLoading(true);

    axiosInstance.get('/users/getUserPrfileInfo').then((resp) => {
      setUserName(resp.data[0].username);
      setProfileLoading(false);
    })
      .catch((err) => {
        setProfileLoading(false);
      })
  }

  let playAudio = () => {
    new Audio(audio).play();
  }

  let joinRoom=()=>{
    setJoinBtnLoading(true);

    axiosInstance.post('/rooms/assignPersonToRoom',{roomId:roomDetails.id}).then((resp)=>{
      message.success('Successfully joined the room');
      setJoinBtnLoading(false);
      window.location.reload();
    })
    .catch((err)=>{
      message.error('Not able to join the room');
      setJoinBtnLoading(false);
    })
  };
  
  useEffect(() => {
    checkMemberParticipant();
    getProfile();
  }, []);
  let fetchCodeDetails=(rm_id)=>{
      setPageLoading(true);
      axiosInstance.post('/rooms/getCodeForRoom',{roomId:rm_id}).then((resp)=>{
        console.log(resp);
        setCodeEditorVal(resp.data[0].code);
        setPageLoading(false);
      })
      .catch((err)=>{
        setPageLoading(false);
      })
  }
  let checkMemberParticipant = () => {
    let roomId = location.toString().split('/')[4];
    roomId = roomId.split('?')[0];
    setPageLoading(true);

    axiosInstance.post('/rooms/checkIfPersonIsParticipantOfRoom', { roomId: roomId }).then((resp) => {
      console.log(resp);
      setRoomDetails(resp.data.roomDetails[0]);
      dbRoomId=resp.data.roomDetails[0].id;
      fetchCodeDetails(resp.data.roomDetails[0].id);
      setPageLoading(false);
      setNotSignedIn(false);
      if (resp.data.status == "YES") {
        setPersonIsParticipantOfRoom(true);
      }
      else {
        setPersonIsParticipantOfRoom(false);
      }
    })
      .catch((err) => {
        setNotSignedIn(true);
        setPageLoading(false);
      })
  }
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current?.getValue());
  }

  
  
 
  let saveChanges=(nextCodeVal,nextRoomId)=>{
    setChangesSaved('saving');
    console.log('Debounce');
    axiosInstance.post('/rooms/saveCodeChanges',{
      blob:nextCodeVal,
      roomId:nextRoomId
    }).then((resp)=>{
      setChangesSaved('saved');
    })
    .catch((err)=>{
      setChangesSaved('saved');      
    });
  }
  const handler = useRef(debounce((nextCodeVal,nextRoomId)=>{saveChanges(nextCodeVal,nextRoomId)}, 1000)).current;

  function onEditorChange(e) {
    if(!pageLoading){
      handler(e,roomDetails.id);
    }

    let name = location.toString().split('?')[1];
    if (props.socket) {
      props.socket.emit('newCode', e, roomId);
    }
  }
  useEffect(() => {
    if (props.socket && !isCalledRef.current) {
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
        const uniqueTags = [];
        participats.map(part => {
            if (uniqueTags.indexOf(part.name) === -1) {
                uniqueTags.push(part.name)
            }
        });
        console.log(uniqueTags);
        setParticipants(uniqueTags);

        if (props.socket.id == socketId) {
          // console.log('Got confirmation for joining room :',roomId);
          // message.success(`Successfully joined the room with room id ${roomId}`);
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
        const uniqueTags = [];
        members.map(part => {
            if (uniqueTags.indexOf(part.name) === -1) {
                uniqueTags.push(part.name)
            }
        });
        setParticipants(uniqueTags);
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
          <div className="playground_wrapper">
            <img src={Ellipse}></img>
          </div>
        ) : (
          (personIsParticipantOfRoom && !notSignedIn) ? (
            <>
              <Header changesSaved={changesSaved} username={username} participats={roomParticipants} socket={props.socket} roomDetails={roomDetails}></Header>
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
            (notSignedIn) ? (
              <div className="singInRequire">
                <div className="message_singin">
                  You are not signed in
                  <br></br>
                  Please SignIn to continue
                </div>
                <div className="btn_wrap">
                  <button onClick={() => {
                    history('/');
                  }}>Sign In</button>
                </div>
              </div>
            ) : (
              <div className="nott_ppart_wrap">
               <div className='header_area_top'>
                  <div className='brandSec'>
                    <img
                      style={{ width: "40px", marginRight: "10px" }}
                      src={handshakes}
                    ></img>
                    <div>COLLABORATOR </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div className='opts_btn' onClick={() => { localStorage.removeItem('token'); history('/'); }}>
                      <FontAwesomeIcon icon={faSignOutAlt} />
                    </div>
                    <div className='opts_btn' onClick={() => { setDrawerOpen(true) }}>
                      <FontAwesomeIcon icon={faBars} />
                    </div>
                  </div>
                </div>
                
                <div className="not_part_wrap">
                <Drawer
                  title=""
                  placement="right"
                  onClose={() => { setDrawerOpen(false) }} visible={drawerOpen}>

                  <div className='drawer_wrap'>
                    {
                      (profileLoading) ? (
                        'Loading'
                      ) : (
                        <>
                          <div className='profileavatar'>
                            <Avatar size={70} icon={<UserOutlined></UserOutlined>}></Avatar>
                          </div>
                          <div className='username'>
                            {username}</div>
                          <div className='my_rooms'>
                            <div id="rm_head">My Rooms</div>
                            {
                              roomsUnderUser?.map((room) => {
                                return (
                                  <div className='listRoom'>
                                    <div className='roomm_imagee'>
                                      <Avatar shape='square' size="small" src="https://joeschmoe.io/api/v1/random" />
                                    </div>
                                    <div className='ss_divv'>
                                      <div className='room_usr_name'>{room.roomname}</div></div>
                                  </div>
                                )
                              })
                            }
                          </div>
                          <div className='recentRooms'>

                          </div>
                        </>
                      )
                    }
                  </div>
                </Drawer>
               
                <div className="not_part_message">
                  <Avatar
                    src="https://joeschmoe.io/api/v1/random"
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                    icon={<AntDesignOutlined />}
                  />
                </div>
                <div className="rm_name">
                  {roomDetails.roomname}
                </div>
                <div className="rm_deails">
                  {roomDetails.room_description}
                </div>
                <button onClick={joinRoom}>{!joinBtnLoading?('Join Room'):(<Spin></Spin>)}</button>
              </div>
              </div>        
            )
          )
        )
      }

    </div>
  );
}
