import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    axios
      .get(`http://localhost:5000/api/users/by-username/${storedUser}`)
      .then((res) => setUserData(res.data))
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);

  const handleJoin = () => {
    console.log("Join clicked");
  };

  const handleCreate = () => {
    console.log("Create clicked");
  };

  if (!userData) {
    return <div className="text-white p-8">Loading user info...</div>;
  }

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar onJoin={handleJoin} onCreate={handleCreate} />
        <div className="flex-1 p-8">
          <div className="flex items-center space-x-10">
            {/* User Info */}
            <div className="space-y-4 w-full max-w-sm">
              <div>
                <label className="block text-sm font-semibold text-gray-300">
                  Username
                </label>
                <input
                  disabled
                  value={userData.username}
                  className="w-full mt-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300">
                  Joined At
                </label>
                <input
                  disabled
                  value={new Date(userData.joinedAt).toLocaleString()}
                  className="w-full mt-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300">
                  Collab Boards
                </label>
                <input
                  disabled
                  value={userData.collabs.length}
                  className="w-full mt-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
                />
              </div>
            </div>
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl font-bold shadow">
              {userData.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
