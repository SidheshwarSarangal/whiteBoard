import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

import { SocketContext } from "../context/SocketContext";
import RoomUsers from "../components/RoomUsers";
import RoomInfo from "../components/RoomInfo";
import DrawingPane from "../components/DrawingPane";
import DrawingTools from "../components/DrawingTools";

const Room = () => {
  const { roomId } = useParams();
  const socket = useContext(SocketContext);

  const [handleUndo, setHandleUndo] = useState(() => () => {});
  const [handleRedo, setHandleRedo] = useState(() => () => {});

  const [roomData, setRoomData] = useState(null);
  const [tool, setTool] = useState("pen");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fill, setFill] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    socket.emit("join_room", { roomId, username: user });

    axios.get(`http://localhost:5000/api/rooms/${roomId}`).then((res) => {
      setRoomData(res.data);
    });
  }, [roomId, socket]);

  const handleDownload = (format) => {
    const canvas = document.getElementById("drawing-canvas");
    if (!canvas) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    const dataUrl = tempCanvas.toDataURL(
      `image/${format === "jpg" ? "jpeg" : "png"}`
    );

    if (format === "pdf") {
      const pdf = new jsPDF();
      pdf.addImage(dataUrl, "PNG", 10, 10, 180, 160);
      pdf.save(`drawing-${roomId}.pdf`);
    } else {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `drawing-${roomId}.${format}`;
      a.click();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <DrawingTools
        tool={tool}
        setTool={setTool}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        fillColor={fillColor}
        setFillColor={setFillColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        fill={fill}
        setFill={setFill}
        handleDownload={handleDownload}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      <div className="flex flex-1">
        <RoomUsers roomId={roomId} roomData={roomData} />
        <DrawingPane
          roomId={roomId}
          tool={tool}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          fill={fill}
          setUndoHandler={setHandleUndo}
          setRedoHandler={setHandleRedo}
        />
        <RoomInfo roomId={roomId} roomData={roomData} />
      </div>
    </div>
  );
};

export default Room;
