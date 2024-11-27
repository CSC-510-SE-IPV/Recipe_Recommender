import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot from react-dom/client
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";

// Get the root element from the DOM
const rootElement = document.getElementById("root");

// Create the root using ReactDOM.createRoot
const root = ReactDOM.createRoot(rootElement);

// Render the App component inside ChakraProvider and React.StrictMode
root.render(
  <ChakraProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
