import React, { useEffect, useState } from 'react'
import './Resizer.css';
import { Modal, Button } from 'antd';

export default function RoomsViewButton(props) {
  let [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Modal footer={null} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {
          <div className='usrList_wrap'>
            {(props.usersLoading) ? (
              'Loading'
            ) : (
              props.usersUnderRoom?.map((usr) => {
                return (
                  <div className='user_nam'>{usr.username}</div>
                )
              })
            )}
          </div>
        }
      </Modal>
      <div className='v_my_users'>
        <button onClick={showModal}>View Users</button>
      </div>
    </>
  )
}
