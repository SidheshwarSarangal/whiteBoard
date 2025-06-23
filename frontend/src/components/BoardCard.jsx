import React from "react";
import { useNavigate } from "react-router-dom";

const WhiteboardCard = ({ title, description, access, image, roomId }) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div
      className="relative w-64 h-40 rounded-lg overflow-hidden cursor-pointer group transition-transform hover:scale-105 duration-300 shadow-md"
      onClick={handleOpen}
    >
      {/* Background Image */}
      <img src={image} alt={title} className="w-full h-full object-cover" />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`px-2 py-1 text-xs rounded ${
              access === "Public" ? "bg-green-500" : "bg-yellow-500"
            }`}
          >
            {access}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent bubbling
              handleOpen();
            }}
            className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardCard;
