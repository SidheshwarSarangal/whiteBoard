import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const CreateSessionModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState(""); // ✅ New state for password

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomId = `room-${Math.random().toString(36).slice(2, 17)}`;
    const user = JSON.parse(localStorage.getItem("user"));
    const owner = user || "guest_user";

    const payload = {
      roomId,
      name,
      isPrivate: !isPublic,
      owner,
      description,
    };

    if (!isPublic && password.trim() !== "") {
      payload.password = password; // ✅ Add password only if not public
    }

    try {
      const res = await axios.post("http://localhost:5000/api/rooms", payload);

      if (!isPublic && password.trim()) {
        await axios.put(`http://localhost:5000/api/rooms/rooms/${roomId}`, {
          password,
        });
      }

      toast.success("Room created successfully!");
      onClose();
      navigate(`/room/${roomId}`);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Room creation failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-[#1e1e2f] w-full max-w-md rounded-md shadow-lg p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Create Session</h3>
          <button className="text-gray-300 text-xl " onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Whiteboard Name"
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            placeholder="Purpose / Description"
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center justify-left gap-4">
            <span className="text-gray-300 font-medium">Public Access</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
            </label>
          </div>

          {/* ✅ Show password input when room is private */}
          {!isPublic && (
            <input
              type="password"
              placeholder="Set a Password"
              className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring focus:ring-red-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-400 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600"
            >
              Create & Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionModal;
