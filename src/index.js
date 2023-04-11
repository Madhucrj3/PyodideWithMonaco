import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
const loadPyodides = async () => {
  const startTime = performance.now();
  const pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/",
  });
  await pyodide.loadPackage(["micropip"]);
  const micropip = pyodide.pyimport("micropip");
  await micropip.install("vega-datasets");
  //await micropip.install("requests");
  const loadTime = performance.now() - startTime;
  console.log("loadTime " + loadTime / 1000 + "s");
  const usedHeapSize = pyodide._module.HEAP8.buffer.byteLength / (1024 * 1024);

  console.log(`Heap size: ${usedHeapSize.toFixed(2)} MB`);
  window.pyodides = pyodide;
};
loadPyodides();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
