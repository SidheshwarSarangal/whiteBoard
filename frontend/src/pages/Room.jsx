import React from "react";
import RoomUsers from "../components/RoomUsers";
import RoomChat from "../components/RoomChat";
import DrawingPane from "../components/DrawingPane";
import DrawingTools from "../components/DrawingTools";

const Room = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <DrawingTools />

      <div className="flex flex-1">
        <RoomUsers />
        <DrawingPane />
        <RoomChat />
      </div>
    </div>
  );
};

export default Room;
