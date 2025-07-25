import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { SocketContext } from "./context/SocketContext";
import { io } from "socket.io-client";

const socket = io("https://whiteboard-svwy.onrender.com"); // ✅ Only initialized here

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <App />
    </SocketContext.Provider>
  </React.StrictMode>
);
