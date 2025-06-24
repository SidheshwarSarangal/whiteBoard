import React, { useState, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { useParams } from "react-router-dom";

const DrawingTools = ({
  tool,
  setTool,
  strokeColor,
  setStrokeColor,
  fillColor,
  setFillColor,
  strokeWidth,
  setStrokeWidth,
  fill,
  setFill,
  handleDownload,
  onUndo,
  onClearCanvas, // 👈 Add this
  onRedo,
}) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const socket = useContext(SocketContext);
  const { roomId } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const [allowed, setAllowed] = useState(false);

  React.useEffect(() => {
    fetch(`http://localhost:5000/api/rooms/${roomId}`)
      .then((res) => res.json())
      .then((roomData) => {
        if (
          roomData.owner === user ||
          (roomData.allowedUsers && roomData.allowedUsers.includes(user))
        ) {
          setAllowed(true);
        }
      });
  }, [roomId, user]);

  const triggerDownload = (format) => {
    handleDownload(format);
    setShowDownloadMenu(false);
  };

  return (
    <div className="w-full p-3 bg-gray-800 flex flex-wrap gap-3 items-center justify-center relative z-10">
      {allowed && (
        <>
          <select
            className="bg-gray-700 text-white px-2 py-1 rounded"
            value={tool}
            onChange={(e) => setTool(e.target.value)}
          >
            <option value="pen">Pen</option>
            <option value="eraser">Eraser</option>
            <option value="text">Text</option>
            <option value="line">Line</option>
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
          </select>

          <label className="text-white">Color</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
          />

          <label className="text-white">Size</label>
          <select
            className="bg-gray-700 text-white px-2 py-1 rounded"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          >
            {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <label className="text-white flex items-center gap-2">
            <input
              type="checkbox"
              checked={fill}
              onChange={(e) => setFill(e.target.checked)}
            />
            Fill Shape
          </label>

          <button
            onClick={onUndo}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Undo
          </button>
          <button
            onClick={onRedo}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            Redo
          </button>
          <button
            onClick={onClearCanvas}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Clear Canvas
          </button>
        </>
      )}

      <div className="relative">
        <button
          onClick={() => setShowDownloadMenu((prev) => !prev)}
          className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
        >
          Download As...
        </button>

        {showDownloadMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white text-black rounded shadow-md z-50">
            {["png", "jpg", "pdf"].map((format) => (
              <div
                key={format}
                role="button"
                onClick={() => triggerDownload(format)}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {format.toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawingTools;
