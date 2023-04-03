const runScripts = async (code_content, code_input, handleChangeOutput) => {
  let result = "";
  let input = [];
  function createStdin() {
    let inputIndex = 0;
    function stdin() {
      if (inputIndex < input.length) {
        let character = input[inputIndex];
        inputIndex++;
        return character;
      } else {
        throw new Error("Input value is empty");
      }
    }
    return stdin;
  }
  const handleOutput = (msg) => {
    result = result + msg + "\n";
    console.log(msg);
  };
  if (code_input.length > 0) {
    const myArray = code_input.split("\n");
    input = myArray;
  }
  //window.pyodides.setInterruptHandler(interruptHandler);
  try {
    await window.pyodides.setStdin({ stdin: createStdin() });
    await window.pyodides.setStdout({ batched: (msg) => handleOutput(msg) });
    await window.pyodides.setStderr({ batched: (msg) => console.log(msg) });
    await window.pyodides.runPythonAsync(code_content);
    handleChangeOutput(result);
  } catch (e) {
    handleChangeOutput(e);
    console.log(e);
  }
  return result;
};
export { runScripts };
