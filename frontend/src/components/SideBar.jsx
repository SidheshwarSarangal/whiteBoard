// src/components/Sidebar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/home";

  return (
    <div className="w-64 bg-gray-100 h-full shadow-md p-5">
      <h2 className="text-xl font-bold mb-6 text-blue-600">Menu</h2>
      <ul className="space-y-4">
        <li
          className={`cursor-pointer px-4 py-2 rounded-md ${
            isDashboard ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => navigate("/home")}
        >
          Dashboard
        </li>
        <li
          className={`cursor-pointer px-4 py-2 rounded-md ${
            !isDashboard ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => navigate("/profile")}
        >
          Profile
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
