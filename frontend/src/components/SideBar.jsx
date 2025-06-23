import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/home";
  const isProfile = location.pathname === "/profile";

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="w-64 cursor-default bg-gray-100 h-screen shadow-md flex flex-col justify-between p-5 relative">
      <div>
        <h2 className="text-xl font-bold mb-6 text-blue-600">Menu</h2>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer px-4 py-2 rounded-md ${
              isDashboard
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => navigate("/home")}
          >
            Dashboard
          </li>
          <li
            className={`cursor-pointer px-4 py-2 rounded-md ${
              isProfile
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => navigate("/profile")}
          >
            Profile
          </li>
        </ul>
      </div>

      {/* Logout Button */}
      <div className="pt-6">
        <button
          className="w-full px-4 py-2 mt-4 mb-8  text-red-400 border-2 border-red-300 rounded-md hover:bg-red-500 hover:text-white transition duration-300 ease-in-out"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </div>

      {/* Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50  backdrop-blur-sm">
          <div className="bg-white p-6 rounded-md shadow-md text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Confirm Logout</h3>
            <p className="text-gray-600">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
