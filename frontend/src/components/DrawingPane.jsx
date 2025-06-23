import React, { useEffect, useRef, useContext, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";

const DrawingPane = ({ roomId, tool, strokeColor, strokeWidth, fill }) => {
  const socket = useContext(SocketContext);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const previewCtxRef = useRef(null);
  const isDrawing = useRef(false);
  const startPos = useRef(null);
  const points = useRef([]);

  // Setup canvases and load previous strokes
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    contextRef.current = ctx;

    const previewCanvas = previewCanvasRef.current;
    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;
    previewCtxRef.current = previewCanvas.getContext("2d");

    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`http://localhost:5000/api/drawings/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          res.data.forEach(({ strokeData }) => drawStroke(strokeData, ctx));
        }
      });

    socket.on("drawing", (stroke) => drawStroke(stroke, ctx));

    return () => socket.off("drawing");
  }, [roomId, socket]);

  // Draw any kind of stroke
  const drawStroke = ({ type, color, width, fill, points }, ctx) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();

    if (type === "pen" || type === "eraser") {
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    } else if (type === "line") {
      const [start, end] = points;
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    } else if (type === "rectangle") {
      const [start, end] = points;
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const w = Math.abs(end.x - start.x);
      const h = Math.abs(end.y - start.y);
      fill ? ctx.fillRect(x, y, w, h) : ctx.strokeRect(x, y, w, h);
    } else if (type === "circle") {
      const [start, end] = points;
      const radius = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
      fill ? ctx.fill() : ctx.stroke();
    }
  };

  const clearPreview = () => {
    const ctx = previewCtxRef.current;
    ctx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
  };

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    isDrawing.current = true;
    startPos.current = { x: offsetX, y: offsetY };
    points.current = [{ x: offsetX, y: offsetY }];
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const currentPos = { x: offsetX, y: offsetY };

    if (tool === "pen" || tool === "eraser") {
      const ctx = contextRef.current;
      const color = tool === "eraser" ? "#ffffff" : strokeColor;
      const stroke = {
        type: tool,
        color,
        width: strokeWidth,
        points: [points.current[points.current.length - 1], currentPos],
      };
      drawStroke(stroke, ctx);
      points.current.push(currentPos);
    } else {
      clearPreview();
      const stroke = {
        type: tool,
        color: strokeColor,
        width: strokeWidth,
        fill,
        points: [startPos.current, currentPos],
      };
      drawStroke(stroke, previewCtxRef.current);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    clearPreview();

    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pen" || tool === "eraser") {
      points.current.push({ x: offsetX, y: offsetY });

      const stroke = {
        type: tool,
        color: tool === "eraser" ? "#ffffff" : strokeColor,
        width: strokeWidth,
        points: [...points.current],
      };

      drawStroke(stroke, contextRef.current);
      socket.emit("drawing", { roomId, stroke });

      const token = localStorage.getItem("token");
      if (token) {
        axios.post(
          "http://localhost:5000/api/drawings",
          { roomId, strokeData: stroke },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      points.current = [];
      return;
    }

    const stroke = {
      type: tool,
      color: strokeColor,
      width: strokeWidth,
      fill,
      points: [startPos.current, { x: offsetX, y: offsetY }],
    };

    drawStroke(stroke, contextRef.current);
    socket.emit("drawing", { roomId, stroke });

    const token = localStorage.getItem("token");
    if (token) {
      axios.post(
        "http://localhost:5000/api/drawings",
        { roomId, strokeData: stroke },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  return (
    <div className="flex-1 bg-white relative">
      <canvas id="drawing-canvas" ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <canvas ref={previewCanvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
      <div
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default DrawingPane;
