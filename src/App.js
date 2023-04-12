import { useEffect, useState } from "react";
import Editors from "./components/Editor";
// import { asyncRun, handleterminate } from "./pyodide";
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
  //console.log(asyncRu
  let pyodideWorker;
  let interruptBuffer = new Uint8Array(new ArrayBuffer(4));

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
    pyodideWorker = new Worker("/webworker.js");
    const script = code;
    // const context = {
    //   A_rank: [0.8, 0.4, 1.2, 3.7, 2.6, 5.8],
    // };
    // // let text1 = text.split("\n");
    // // console.log(text1);
    // // const context = {
    // //   A_rank: text1,
    // // };
    // async function main() {
    //   try {
    //     const { results, error } = await asyncRun(script, context);
    //     if (results) {
    //       console.log("pyodideWorker return results: ", results);
    //     } else if (error) {
    //       console.log("pyodideWorker error: ", error);
    //     }
    //   } catch (e) {
    //     console.log(
    //       `Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`
    //     );
    //   }
    // }
    // main();
    async function runCode(code) {
      // Clear interruptBuffer in case it was accidentally left set after previous code completed.
      interruptBuffer[0] = 0;
      pyodideWorker.postMessage({ cmd: "runCode", code });
    }
    runCode(script);
  };
  const handleStop = () => {
    // pyodideWorker.postMessage({ cmd: "setInterruptBuffer", interruptBuffer });
    // function interruptExecution() {
    //   // 2 stands for SIGINT.
    //   interruptBuffer[0] = 2;
    // }
    // interruptExecution();
    console.log("stopped");
    pyodideWorker.postMessage({ cmd: "setInterruptBuffer", interruptBuffer });
    function interruptExecution() {
      // 2 stands for SIGINT.
      interruptBuffer[0] = 2;
    }
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
        <PyodideButton onClick={handleStop}>Stop</PyodideButton>
      </AppContainer>
    </>
  );
};
export default App;
