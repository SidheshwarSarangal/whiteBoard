import React, { useEffect, useRef, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";

const DrawingPane = ({ roomId, tool, strokeColor, strokeWidth }) => {
  const socket = useContext(SocketContext);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const contextRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    contextRef.current = ctx;

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("🚫 No token found in localStorage");
      return;
    }

    // ✅ Fetch previous strokes using axios
    axios
      .get(`http://localhost:5000/api/drawings/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          res.data.forEach(({ strokeData }) => drawStroke(strokeData));
        } else {
          console.warn("Unexpected response format:", res.data);
        }
      })
      .catch((err) => {
        console.error(
          "❌ Failed to fetch strokes",
          err.response?.data || err.message
        );
      });

    // ✅ Listen for real-time strokes
    socket.on("drawing", (stroke) => {
      drawStroke(stroke);
    });

    return () => {
      socket.off("drawing");
    };
  }, [roomId, socket]);

  const drawStroke = ({ type, color, width, points }) => {
    const ctx = contextRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = e.nativeEvent;
    lastPos.current = { x: offsetX, y: offsetY };
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };

    const stroke = {
      type: tool,
      color: strokeColor,
      width: strokeWidth,
      points: [lastPos.current, newPoint],
    };

    drawStroke(stroke);
    socket.emit("drawing", { roomId, stroke });

    // ✅ Save stroke via axios
    const token = localStorage.getItem("token");
    if (token) {
      axios.post(
        "http://localhost:5000/api/drawings",
        { roomId, strokeData: stroke },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    lastPos.current = newPoint;
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="flex-1 bg-white relative">
      <canvas
        id="drawing-canvas"
        className="w-full h-full"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default DrawingPane;
