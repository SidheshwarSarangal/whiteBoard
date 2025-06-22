import React, { useState } from "react";

const JoinSessionModal = ({ onClose, onJoin }) => {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin({ roomId, password });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#1e1e2f] text-white rounded-lg shadow-xl p-6 w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Join Whiteboard</h2>
          <button className="text-white text-xl" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Whiteboard ID"
            required
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white mb-4 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password (if private)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white mb-4 focus:outline-none"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinSessionModal;
