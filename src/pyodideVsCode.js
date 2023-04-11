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
  // Define a function to monitor memory usage
  function monitorMemoryUsage() {
    const usedHeapSize =
      window.pyodides._module.HEAP8.buffer.byteLength / (1024 * 1024);
    const totalMemory = performance.memory.jsHeapSizeLimit / (1024 * 1024);
    const usedMemory = performance.memory.usedJSHeapSize / (1024 * 1024);
    console.log(`Heap size: ${usedHeapSize.toFixed(2)} MB`);
    console.log(`Total memory: ${totalMemory.toFixed(2)} MB`);
    console.log(`Memory usage: ${usedMemory.toFixed(2)} MB`);
  }

  // Call the function to monitor memory usage at regular intervals

  //window.pyodides.setInterruptHandler(interruptHandler);
  try {
    await window.pyodides.setStdin({ stdin: createStdin() });
    // await window.pyodides.setStdout({ batched: (msg) => handleOutput(msg) });
    await window.pyodides.setStderr({ batched: (msg) => console.log(msg) });
    monitorMemoryUsage();
    await window.pyodides.runPythonAsync(code_content);
    handleChangeOutput(result);
  } catch (e) {
    handleChangeOutput(e);
    console.log(e);
  }
  return result;
};
export { runScripts };
