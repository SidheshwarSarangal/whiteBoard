import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const JoinSessionModal = ({ onClose }) => {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("You must be signed in to join a session.");
      return;
    }

    try {
      // Update the user's collabs with this roomId
      await axios.post("http://localhost:5000/api/users/add-room-to-collabs", {
        username: user,
        roomId,
      });

      // Try joining the room
      const res = await axios.post("http://localhost:5000/api/rooms/join", {
        roomId,
        username: user,
        password,
      });

      toast.success("Joined with view and edit allowance");
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to join the room. Try again.";
      toast.error("Joined as View only!");
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#1e1e2f] text-white rounded-lg shadow-xl p-6 w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Join Whiteboard</h2>
          <button className="text-white text-xl" onClick={onClose}>
            ×
          </button>
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
