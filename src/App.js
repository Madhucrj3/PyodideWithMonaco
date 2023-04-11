import { useState } from "react";
import Editors from "./components/Editor";
import { asyncRun, stop } from "./pyodide";
import { runScripts } from "./pyodideVsCode";
import {
  AppContainer,
  PyodideButton,
  PyodideInput,
  PyodideInputContainer,
  PyodideInputOutputContainer,
  PyodideOutputContainer,
  PyodideText,
} from "./styledComponent";
const App = () => {
  const [code, setCode] = useState("");
  const [text, setText] = useState("");
  const [argument, setArgument] = useState("");
  const [output, setOutput] = useState("");
  // console.log(asyncRun(code));
  const handleChangeOutput = (result) => {
    setOutput(result);
  };
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
    await runScripts(code, text, handleChangeOutput);
    const end = performance.now();
    console.log((end - start) / 1000 + "s");
  };

  return (
    <>
      <AppContainer>
        <Editors setCodeMonaco={setCodeMonaco} />
        <PyodideInputOutputContainer>
          <PyodideInputContainer>
            <PyodideText>Input</PyodideText>
            <PyodideInput
              value={text}
              onChange={handleChange}
              rows="14"
              cols="65"
            />
          </PyodideInputContainer>
          <PyodideOutputContainer>
            <PyodideText>Output</PyodideText>
            <PyodideInput value={output} rows="14" cols="65" />
          </PyodideOutputContainer>
        </PyodideInputOutputContainer>
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
