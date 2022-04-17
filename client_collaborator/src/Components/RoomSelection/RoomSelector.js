import React, { useState, useEffect } from 'react'
import { axiosInstance } from '../../utils/axiosInterceptor';
import handshakes from "../../assests/handshake.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './RoomSelector.css';
import NewRoomModal from '../LogOut/NewRoomModal';
import RoomJoinModal from '../LogOut/RoomJoinModal';
import { useNavigate } from "react-router-dom";
import { nanoid } from 'nanoid'
import { message } from 'antd';
import { Popover, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { Drawer } from 'antd';

export default function RoomSelector(props) {
  const history = useNavigate();

  let [newRoomModalOpen, setNewRoomModalOpen] = useState(false);
  let [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  let [visible, setVisible] = useState(false);
  let [btnLoading, setBtnLoading] = useState(false);
  let [roomsUnderUser, setRoomUnderUser] = useState(null);
  let [drawerOpen, setDrawerOpen] = useState(false);
  let [profileLoading, setProfileLoading] = useState(false);
  let [username, setUserName] = useState(null);

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
  let usernameRegex = (name) => {
    let pattern = /^\S*$/;
    return pattern.test(name);
  }

  let fetchRooms = () => {
    let token = localStorage.token;
    console.log(token);
    setProfileLoading(true);
    axiosInstance.get('/rooms/getRoomsUnderUser').then((resp) => {
      console.log(resp.data.message);
      setProfileLoading(false);
      setRoomUnderUser(resp.data.message);
    })
      .catch((err) => {
        setProfileLoading(false);
      })
  }
  let newRoomJoin = (roomName, roomDescription) => {
    setBtnLoading(true);
    let nanoId = nanoid(10);

    axiosInstance.post('/rooms/createAndAssignRoom', {
      roomname: roomName,
      room_description: roomDescription,
      room_id: nanoId
    }).then((resp) => {
      setBtnLoading(false);
      message.success('New Room Created successfully!');
    })
      .catch((err) => {
        message.success('Some error occured');
        setBtnLoading(false);
      })
  };

  let joinARoom = (name, roomId) => {
    if (usernameRegex(name)) {
      props.socket.emit('checkRoomExistence', roomId, name);
    }
    else {
      message.warning('Invalid username , must not contain spaces');
    }
  };
  useEffect(() => {
    fetchRooms();
    getProfile();
  }, []);
  useEffect(
    () => {
      if (props.socket) {
        props.socket.on('check', (arg) => {
          console.log(arg);
        })
        props.socket.on('confirmNewRoom', (socketId, roomId, name) => {
          console.log(socketId, name);
          console.log('joined the room');

          if (props.socket.id == socketId) {
            console.log('Got confirmation for joining room :', roomId);
            setLoading(false);
          }
        });
        props.socket.on('roomNotFound', (roomId) => {
          message.warn(`Room with ID ${roomId} doesn't exist`)
        });
        props.socket.on('roomFound', (roomId, name) => {
          history(`/playground/${roomId}?${name}`);
          setLoading(true);
        });
      }
    }, [props.socket]
  );
  return (
    <div className='room_selector_wrapper'>
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

      <div className='header_area_top'>
        <div className='brandSec'>
          <img
            style={{ width: "40px", marginRight: "10px" }}
            src={handshakes}
          ></img>
          <div>COLLABORATOR </div>
        </div>
        <div style={{display:'flex'}}>
          <div className='opts_btn' onClick={() => { localStorage.removeItem('token');history('/'); }}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </div>
          <div className='opts_btn' onClick={() => { setDrawerOpen(true) }}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
      </div>
      <div className='recentRoomsBtn'>
        {
          roomsUnderUser ? (roomsUnderUser.map((room) => {
            return (
              <div className='usr_box' onClick={() => {
                history(`/playground/${room.room_id_assigned}?${username}`);
              }}>
                <div className='room_imagee'>
                  <img src='https://lh3.googleusercontent.com/J_9Cx9TsY8_57VCQEOKLLXkeywe5YFvPcKf5Xozm2TZc5LNSUiH6ND0LZtWjI3YBog'></img>
                </div>
                <div className='s_divv'>
                  <div className='room_usr_name'>{room.roomname}</div>
                  <div className='room_description'>{room.room_description}</div>
                </div>
              </div>
            )
          })) : ('Loading')
        }
      </div>
      <div className='optionsButton'>
        <NewRoomModal newRoomJoin={newRoomJoin} newRoomModalOpen={newRoomModalOpen} setNewRoomModalOpen={setNewRoomModalOpen}></NewRoomModal>
        <RoomJoinModal joinARoom={joinARoom} joinRoomModalOpen={joinRoomModalOpen} setJoinRoomModalOpen={setJoinRoomModalOpen}></RoomJoinModal>
        <div className="innerBlurArea">
          <div id="textarea">
            <button onClick={() => {
              setJoinRoomModalOpen(true);
            }}>Join Room</button>
            <button onClick={() => {
              setNewRoomModalOpen(true);
              // newRoomJoin();
            }}>New Room
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
