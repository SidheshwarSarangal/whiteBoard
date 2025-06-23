import React, { useState } from "react";

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
}) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const triggerDownload = (format) => {
    handleDownload(format);
    setShowDownloadMenu(false); // Close dropdown
  };

  return (
    <div className="w-full p-3 bg-gray-800 flex flex-wrap items-center gap-4 justify-center relative">
      {/* Tool Selector */}
      <select
        className="bg-gray-700 text-white px-2 py-1 rounded"
        value={tool}
        onChange={(e) => setTool(e.target.value)}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
        <option value="line">Line</option>
        <option value="rectangle">Rectangle</option>
        <option value="circle">Circle</option>
      </select>

      {/* Stroke Color */}
      <label className="text-white">Stroke</label>
      <input
        type="color"
        value={strokeColor}
        onChange={(e) => setStrokeColor(e.target.value)}
      />

      {/* Stroke Width */}
      <label className="text-white">Size</label>
      <input
        type="range"
        min="1"
        max="20"
        value={strokeWidth}
        onChange={(e) => setStrokeWidth(Number(e.target.value))}
        className="w-32"
      />

      {/* Fill Shape Checkbox */}
      <label className="text-white flex items-center gap-2">
        <input
          type="checkbox"
          checked={fill}
          onChange={(e) => setFill(e.target.checked)}
        />
        Fill Shape
      </label>

      {/* Download Dropdown */}
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
