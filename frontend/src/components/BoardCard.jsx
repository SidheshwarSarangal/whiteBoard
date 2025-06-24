import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WhiteboardCard = ({ title, description, access, roomId }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleOpen = () => {
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`https://whiteboard-svwy.onrender.com/api/drawings/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!Array.isArray(res.data)) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = 256;
        canvas.height = 160;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        res.data.forEach(({ strokeData }) => {
          const { color, width, points } = strokeData;
          if (!points || points.length < 2) return;

          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
        });

        setImageUrl(canvas.toDataURL("image/png"));
      })
      .catch((err) => {
        console.error(
          "Preview fetch error:",
          err.response?.data || err.message
        );
      });
  }, [roomId]);

  return (
    <div
      className="group relative w-64 h-40 rounded-lg overflow-hidden cursor-pointer group transition-transform hover:scale-105 duration-300 shadow-md"
      onClick={handleOpen}
    >
      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Background Image with Dark Overlay */}
      <div className="w-full h-full relative">
        <img
          src={imageUrl || "/placeholder.jpg"}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 z-4" />{" "}
      </div>

      {/* Always Visible Overlay Content */}
      <div className="absolute group-hover:bg-black inset-0 text-white p-4 z-6  flex flex-col justify-between">
        <div>
          <h3 className="text-2xl text-black group-hover:text-white font-bold">{title}</h3>
          <p className="text-xl text-black group-hover:text-white">{description}</p>
        </div>

        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span
            className={`px-2 py-1 text-xs rounded ${
              access === "Public" ? "bg-green-500" : "bg-yellow-500"
            }`}
          >
            {access}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
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
