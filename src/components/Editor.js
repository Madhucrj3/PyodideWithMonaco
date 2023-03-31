import React from "react";
import Editor from "@monaco-editor/react";
const Editors = ({ setCodeMonaco }) => {
  const handleCode = (e) => {
    setCodeMonaco(e);
  };
  return (
    <Editor
      height="50vh"
      defaultLanguage="python"
      defaultValue="#some comment"
      theme="vs-dark"
      onChange={handleCode}
    />
  );
};

export default Editors;
