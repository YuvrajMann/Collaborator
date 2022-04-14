import React, { useState, useEffect } from 'react'
import { axiosInstance } from '../../utils/axiosInterceptor';
import handshakes from "../../assests/handshake.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './RoomSelector.css';
import NewRoomModal from '../LogOut/NewRoomModal';
import RoomJoinModal from '../LogOut/RoomJoinModal';
import { useNavigate } from "react-router-dom";
import { nanoid } from 'nanoid'
import { message } from 'antd';
import { Popover, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

export default function RoomSelector(props) {
  const history = useNavigate();

  let [newRoomModalOpen, setNewRoomModalOpen] = useState(false);
  let [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  let [visible, setVisible] = useState(false);
  let [btnLoading, setBtnLoading] = useState(false);
  let [roomsUnderUser, setRoomUnderUser] = useState(null);

  let usernameRegex = (name) => {
    let pattern = /^\S*$/;
    return pattern.test(name);
  }

  let fetchRooms = () => {
    let token = localStorage.token;
    console.log(token);

    axiosInstance.get('/rooms/getRoomsUnderUser').then((resp) => {
      console.log(resp.data.message);
      setRoomUnderUser(resp.data.message);
    })
      .catch((err) => {

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
      <div className='header_area_top'>
        <div className='brandSec'>
          <img
            style={{ width: "40px", marginRight: "10px" }}
            src={handshakes}
          ></img>
          <div>COLLABORATOR </div>
        </div>
        <Popover
          content={
            <div id="upper_avtar">
              <Avatar size="small" icon={<UserOutlined />} />
              <div id="avtar_btn">
                My Rooms
              </div>
            </div>
          }
          trigger="click"
          visible={visible}
          onVisibleChange={() => { setVisible(!visible) }}
        >
          <div className='opts_btn'>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </Popover>
      </div>
      <div className='recentRoomsBtn'>
        {
          roomsUnderUser ? (roomsUnderUser.map((room) => {
            return (
              <div className='usr_box'>
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
