const RoomChat = () => (
  <div className="w-72 bg-gray-800 flex flex-col">
    <h3 className="text-lg px-4 py-2 border-b border-gray-600">Room Chat</h3>
    <div className="flex-1 overflow-y-auto p-4">
      {/* Messages */}
    </div>
    <div className="p-2 border-t border-gray-600 flex">
      <input
        type="text"
        placeholder="Say something..."
        className="flex-1 px-3 py-1 rounded-l bg-gray-700 text-white"
      />
      <button className="bg-green-600 px-4 rounded-r text-white">➤</button>
    </div>
  </div>
);
export default RoomChat;
