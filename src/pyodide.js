const runScript = async (overallCode) => {
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
    console.log(msg);
  };
  const overallParseCode = JSON.parse(overallCode);
  const code_content = JSON.parse(overallParseCode.code_content);
  const code_input = JSON.parse(overallParseCode.inputs);
  if (code_input.length > 0) {
    const myArray = code_input.split("\n");
    input = myArray;
  }
  //window.pyodides.setInterruptHandler(interruptHandler);
  let result = "";
  try {
    await window.pyodides.setStdin({ stdin: createStdin() });
    await window.pyodides.setStdout({ batched: (msg) => handleOutput(msg) });
    await window.pyodides.setStderr({ batched: (msg) => console.log(msg) });
    result = await window.pyodides.runPythonAsync(code_content);
  } catch (error) {
    console.log(error);
  }
  return result;
};
export { runScript };
