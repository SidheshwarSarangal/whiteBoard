import React, { useEffect, useRef, useContext, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";

const PreviewDrawingPane = ({ roomId }) => {
  const socket = useContext(SocketContext);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [allStrokes, setAllStrokes] = useState([]);

  const drawStroke = (stroke, ctx) => {
    if (!stroke || !stroke.points || !Array.isArray(stroke.points)) return;
    const { type = "pen", color, width, fill, points } = stroke;
    if (!points.length || !ctx) return;

    ctx.strokeStyle = color || "black";
    ctx.fillStyle = color || "black";
    ctx.lineWidth = width || 2;

    if (
      type === "pen" ||
      (!["line", "rectangle", "circle", "eraser"].includes(type) &&
        points.length > 1)
    ) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    } else if (type === "eraser") {
      ctx.beginPath();
      ctx.strokeStyle = "#ffffff";
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    } else if (type === "line" && points.length === 2) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
      ctx.stroke();
    } else if (type === "rectangle" && points.length === 2) {
      const [start, end] = points;
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const w = Math.abs(end.x - start.x);
      const h = Math.abs(end.y - start.y);
      ctx.beginPath();
      fill ? ctx.fillRect(x, y, w, h) : ctx.strokeRect(x, y, w, h);
    } else if (type === "circle" && points.length === 2) {
      const [start, end] = points;
      const radius = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      ctx.beginPath();
      ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
      fill ? ctx.fill() : ctx.stroke();
    }
  };

  const redrawCanvas = (strokes) => {
    const ctx = contextRef.current;
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    strokes.forEach((s) => drawStroke(s, ctx));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    contextRef.current = ctx;

    const token = localStorage.getItem("token");
    if (!token || !roomId) return;

    axios
      .get(`http://localhost:5000/api/drawings/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const strokes = res.data.map((entry) => ({
          ...entry.strokeData,
          _id: entry._id,
        }));
        setAllStrokes(strokes);
        redrawCanvas(strokes);
      });

    socket.on("drawing", ({ stroke }) => {
      if (!stroke || !Array.isArray(stroke.points)) return;
      setAllStrokes((prev) => {
        const updated = [...prev, stroke];
        redrawCanvas(updated);
        return updated;
      });
    });

    socket.on("drawing_deleted", (strokeId) => {
      setAllStrokes((prev) => {
        const updated = prev.filter((s) => s._id !== strokeId);
        redrawCanvas(updated);
        return updated;
      });
    });

    return () => {
      socket.off("drawing");
      socket.off("drawing_deleted");
    };
  }, [roomId, socket]);

  return (
    <div className="flex-1 bg-white relative">
      <canvas
        id="drawing-canvas"
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default PreviewDrawingPane;
