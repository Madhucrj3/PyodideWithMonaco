import { useState } from "react";
import Editors from "./components/Editor";
import { runScript } from "./pyodide";
import { runScripts } from "./pyodideVsCode";
import {
  AppContainer,
  PyodideButton,
  PyodideInput,
  PyodideText,
} from "./styledComponent";
const App = () => {
  const [code, setCode] = useState("");
  const [text, setText] = useState("");
  const [argument, setArgument] = useState("");
  const handleChange = (event) => {
    setText(event.target.value);
  };
  const handleArguments = (event) => {
    setArgument(event.target.value);
  };
  const setCodeMonaco = (value) => {
    setCode(value);
  };
  const handleArgumentLoading = async () => {
    let argumentsArray = [];
    const myArray = argument.split("\n");
    argumentsArray = myArray;
    console.log(argumentsArray);
    const pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/",
      args: argumentsArray,
    });
    window.pyodides = pyodide;
  };
  const handleRun = async () => {
    if (argument.length > 0) {
      await handleArgumentLoading();
    }
    const start = performance.now();
    console.clear();
    await runScripts(code, text);
    const end = performance.now();
    console.log((end - start) / 1000 + "s");
  };
  return (
    <>
      <AppContainer>
        <Editors setCodeMonaco={setCodeMonaco} />
        <PyodideText>Input</PyodideText>
        <PyodideInput
          value={text}
          onChange={handleChange}
          rows="14"
          cols="50"
        />
        <PyodideText>Arguments</PyodideText>
        <PyodideInput
          value={argument}
          onChange={handleArguments}
          rows="5"
          cols="50"
        />
        <PyodideButton onClick={handleRun}>Run</PyodideButton>
      </AppContainer>
    </>
  );
};
export default App;
