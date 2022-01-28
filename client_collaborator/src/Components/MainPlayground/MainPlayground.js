import React,{useRef} from "react";
import Editor from "@monaco-editor/react";
import SplitPane from "react-split-pane";
import LeftPaneHead from "./LeftPaneHead";
import "./Resizer.css";
import ReactDOM from 'react-dom';
import {DraftEditor,EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import TextEditor from './TextEditor';
export default function MainPlayground(props) {
  const editorRef = useRef(null);
  const [editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  );

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current?.getValue());
  }
  return (

    <SplitPane split="vertical"  defaultSize={'50vw'} >
      <div className="left_area">
        <LeftPaneHead></LeftPaneHead>
        <Editor
          height="100vh"
          
          defaultLanguage="javascript"
          defaultValue="// some comment"
          language="cpp"
          theme="vs-dark"
          onMount={handleEditorDidMount}
        />
      </div>
      <div>
       
      <TextEditor></TextEditor>
      </div>
    </SplitPane>
  );
}
