const DrawingTools = () => (
  <div className="w-full p-3 bg-gray-800 flex justify-center items-center gap-4">
    <select className="bg-gray-700 text-white px-2 py-1 rounded">
      <option>Pen</option>
      <option>Line</option>
      <option>Rectangle</option>
    </select>

    <input type="color" title="Stroke" />
    <input type="color" title="Fill" />
    <input type="range" min="1" max="20" title="Size" className="w-32" />

    <button className="text-white px-2">⤓</button>
    <button className="text-white px-2">✖</button>
  </div>
);
export default DrawingTools;
