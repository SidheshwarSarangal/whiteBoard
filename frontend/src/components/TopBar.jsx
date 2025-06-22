import React, { useState } from "react";
import CreateSessionModal from "./CreateSessionModal";
import JoinSessionModal from "./JoinSessionModal";

const TopBar = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleCreate = (data) => {
    console.log("Session Created:", data);
    // 🧠 TODO: Call backend API to create session
    setShowCreateModal(false);
  };

  const handleJoin = ({ roomId, password }) => {
    console.log("Joining room:", roomId, "with password:", password);
    // 🧠 TODO: Call backend/join API or emit socket event
    setShowJoinModal(false);
  };

  return (
    <>
      <div className="w-full flex justify-end items-center px-6 py-3 bg-gray-900 text-white shadow">
        <button
          className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold mr-4 hover:bg-gray-200"
          onClick={() => setShowJoinModal(true)}
        >
          Join Session
        </button>
        <button
          className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-200"
          onClick={() => setShowCreateModal(true)}
        >
          Create Session
        </button>
      </div>

      {showCreateModal && (
        <CreateSessionModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {showJoinModal && (
        <JoinSessionModal
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoin}
        />
      )}
    </>
  );
};

export default TopBar;
