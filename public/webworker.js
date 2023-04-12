// webworker.js

// Setup your project to serve `py-worker.js`. You should also serve
// `pyodide.js`, and all its associated `.asm.js`, `.json`,
// and `.wasm` files as well:
importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.0/full/pyodide.js");

async function loadPyodideAndPackages() {
  console.log("load");
  self.pyodide = await loadPyodide();
  await self.pyodide.loadPackage(["numpy", "pytz"]);
}
let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
  console.log("onmess");
  await pyodideReadyPromise;
  // make sure loading is done
  console.log(event);
  // await pyodideReadyPromise;
  // Don't bother yet with this line, suppose our API is built in such a way:
  const { id, python, ...context } = event.data;
  // The worker copies the context in its own "memory" (an object mapping name to values)
  for (const key of Object.keys(context)) {
    self[key] = context[key];
  }
  let result = "";
  let input = ["1", "2"];
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
  // Now is the easy part, the one that is similar to working in the main thread:
  try {
    // await self.pyodide.loadPackagesFromImports(python);
    await self.pyodide.setStdin({ stdin: createStdin() });
    await self.pyodide.setStdout({ batched: (msg) => handleOutput(msg) });
    let results = await self.pyodide.runPythonAsync(python);
    self.postMessage({ results, id });
  } catch (error) {
    self.postMessage({ error: error.message, id });
  }
};
self.addEventListener("message", (msg) => {
  if (msg.data.cmd === "setInterruptBuffer") {
    console.log("stopped buffer");
    self.pyodide.setInterruptBuffer(msg.data.interruptBuffer);
    return;
  }
  if (msg.data.cmd === "runCode") {
    self.pyodide.runPythonAsync(msg.data.code);
    return;
  }
});
