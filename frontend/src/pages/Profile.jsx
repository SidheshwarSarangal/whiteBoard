import React from "react";
import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";

const Profile = () => {
  const user = {
    id: "newuser1@gmail.com",
    password: "********",
  };

  const handleJoin = () => {
    console.log("Join clicked");
  };

  const handleCreate = () => {
    console.log("Create clicked");
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar onJoin={handleJoin} onCreate={handleCreate} />

        <div className="flex-1 p-8">
          <div className="flex items-center space-x-10">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl font-bold shadow">
              {user.id.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="space-y-4 w-full max-w-sm">
              <div>
                <label className="block text-sm font-semibold text-gray-300">
                  User ID
                </label>
                <input
                  disabled
                  value={user.id}
                  className="w-full mt-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300">
                  Password
                </label>
                <input
                  disabled
                  value={user.password}
                  className="w-full mt-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Whiteboard Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {["My Boards", "Collab Boards", "All Boards"].map((label) => (
              <div
                key={label}
                className="bg-gray-800 border border-gray-600 p-4 rounded-lg text-center shadow"
              >
                <p className="text-2xl font-bold text-green-400">0</p>
                <p className="text-sm text-gray-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
