const RoomUsers = () => (
  <div className="w-60 bg-gray-800 p-4 flex flex-col justify-between">
    <div>
      <h3 className="text-lg mb-4">In Room</h3>
      <p className="text-green-400">🟢 NEW USER</p>
    </div>
    <button className="mt-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
      ⏎ Exit Room
    </button>
  </div>
);
export default RoomUsers;
