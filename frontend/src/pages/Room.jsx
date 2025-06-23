import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { SocketContext } from "../context/SocketContext";
import RoomUsers from "../components/RoomUsers";
import RoomChat from "../components/RoomChat";
import DrawingPane from "../components/DrawingPane";
import DrawingTools from "../components/DrawingTools";

const Room = () => {
  const { roomId } = useParams();
  const socket = useContext(SocketContext);

  const [roomData, setRoomData] = useState(null);
  const [tool, setTool] = useState("pen");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    socket.emit("join_room", { roomId, username: user });

    axios.get(`http://localhost:5000/api/rooms/${roomId}`).then((res) => {
      setRoomData(res.data);
    });
  }, [roomId, socket]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <DrawingTools
        tool={tool}
        setTool={setTool}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
      />

      <div className="flex flex-1">
        <RoomUsers roomId={roomId} roomData={roomData} />
        <DrawingPane
          roomId={roomId}
          tool={tool}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
        />
        <RoomChat roomId={roomId} roomData={roomData} />
      </div>
    </div>
  );
};

export default Room;
