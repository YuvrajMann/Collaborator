import React, {useState,useEffect} from 'react';
import RichTextEditor from 'react-rte';
export default function MyStatefulEditor(props){
  let [state,setState]=useState(RichTextEditor.createEmptyValue());
  let onChange = (value) => {
        setState(value);
        let location=window.location.href;
        let roomId=location.toString().split('/')[4];
        roomId=roomId.split('?')[0];
        let name=location.toString().split('?')[1];
        if(props.socket){
          // value=JSON.stringify(value);
          value=value.toString('html')
          props.socket.emit('newEditorState',value,roomId);  
        }
  }
  useEffect(()=>{
    if(props.socket){
      props.socket.on('newEditorState',(value,socketId,roomId)=>{
        if(props.socket.id.toString()!=socketId.toString()){
          // value=JSON.parse(value);
          let newState=RichTextEditor.createValueFromString(value,'html');
          setState(newState);
          // console.log(value);
        }
      })
    }
  },[props.socket])
      
  return (
    <RichTextEditor
      value={state}
      onChange={onChange}
    />
  );
}
