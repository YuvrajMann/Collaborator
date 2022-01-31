import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import SplitPane from "react-split-pane";
import LeftPaneHead from "./LeftPaneHead";
import "./Resizer.css";
import ReactDOM from "react-dom";
import { DraftEditor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import TextEditor from "./TextEditor";
import Header from './Header';

export default function MainPlayground(props) {
  const editorRef = useRef(null);
  let [language, setLanguage] = useState(null);
  let [theme, setTheme] = useState("vs-dark");

  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current?.getValue());
  }
  return (
    <div>
      <Header></Header>
 <SplitPane split="vertical" defaultSize={"50vw"}>
      <div className="left_area">
        <LeftPaneHead
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
          onMount={handleEditorDidMount}
        />
      </div>
      <div className="right_view_area">
        <TextEditor></TextEditor>
      </div>
    </SplitPane>
   
    </div>
   
  );
}
