import React from "react";
import { toast } from "react-hot-toast";

const RoomInfo = ({ roomData }) => {
  if (!roomData) {
    return (
      <div className="w-72 bg-gray-800 flex flex-col text-white">
        <h3 className="text-lg px-4 py-2 border-b border-gray-600">Room Info</h3>
        <div className="p-4 text-gray-400">Room details not available.</div>
      </div>
    );
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="w-72 cursor-default bg-gray-800 flex flex-col text-white">
      <h3 className="text-lg px-4 py-2 border-b border-gray-600">Room Info</h3>
      <div className="p-4 space-y-2 text-sm">
        <p>
          <span className="font-semibold text-gray-300">Room Name:</span>{" "}
          {roomData.name}
        </p>

        <p className="flex items-center gap-2">
          <span className="font-semibold text-gray-300">Room ID:</span>
          <span>{roomData.roomId}</span>
          <button
            onClick={() => handleCopy(roomData.roomId)}
            className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 text-white"
            title="Copy Room ID"
          >
            Copy
          </button>
        </p>

        <p>
          <span className="font-semibold text-gray-300">Owner:</span>{" "}
          {roomData.owner}
        </p>
        <p>
          <span className="font-semibold text-gray-300">Access:</span>{" "}
          {roomData.isPrivate ? "Private" : "Public"}
        </p>
        {roomData.isPrivate && roomData.password && (
          <p>
            <span className="font-semibold text-gray-300">Password:</span>{" "}
            {roomData.password}
          </p>
        )}
        <p>
          <span className="font-semibold text-gray-300">Description:</span>{" "}
          {roomData.description || "N/A"}
        </p>
        <p>
          <span className="font-semibold text-gray-300">Created At:</span>{" "}
          {new Date(roomData.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default RoomInfo;
