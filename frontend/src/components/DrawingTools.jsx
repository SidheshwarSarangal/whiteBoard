import React from "react";

const DrawingTools = ({ tool, setTool, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth }) => {
  return (
    <div className="w-full p-3 bg-gray-800 flex justify-center items-center gap-4">
      <select
        className="bg-gray-700 text-white px-2 py-1 rounded"
        value={tool}
        onChange={(e) => setTool(e.target.value)}
      >
        <option value="pen">Pen</option>
        <option value="line">Line</option>
        <option value="rectangle">Rectangle</option>
      </select>

      <input
        type="color"
        title="Stroke"
        value={strokeColor}
        onChange={(e) => setStrokeColor(e.target.value)}
      />

      <input
        type="range"
        min="1"
        max="20"
        value={strokeWidth}
        onChange={(e) => setStrokeWidth(e.target.value)}
        title="Size"
        className="w-32"
      />
    </div>
  );
};

export default DrawingTools;
