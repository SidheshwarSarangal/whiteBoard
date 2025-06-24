import React, {
  useEffect,
  useRef,
  useContext,
  useState,
  useCallback,
} from "react";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";

const DrawingPane = ({
  roomId,
  tool,
  strokeColor,
  strokeWidth,
  fill,
  setUndoHandler,
  setRedoHandler,
}) => {
  const socket = useContext(SocketContext);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const previewCtxRef = useRef(null);
  const isDrawing = useRef(false);
  const startPos = useRef(null);
  const points = useRef([]);

  const [allStrokes, setAllStrokes] = useState([]);
  const [myStrokes, setMyStrokes] = useState([]);
  const [myRedo, setMyRedo] = useState([]);
  const [textInput, setTextInput] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const drawStroke = (stroke, ctx) => {
    if (!stroke || !ctx) return;
    const { type, color, width, fill, points, text, x, y, size } = stroke;
    ctx.strokeStyle = color || "black";
    ctx.fillStyle = color || "black";
    ctx.lineWidth = width || 2;

    if (type === "pen" && points?.length) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    } else if (type === "eraser" && points?.length) {
      ctx.beginPath();
      ctx.strokeStyle = "#ffffff";
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    } else if (type === "line" && points?.length === 2) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
      ctx.stroke();
    } else if (type === "rectangle" && points?.length === 2) {
      const [start, end] = points;
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const w = Math.abs(end.x - start.x);
      const h = Math.abs(end.y - start.y);
      ctx.beginPath();
      fill ? ctx.fillRect(x, y, w, h) : ctx.strokeRect(x, y, w, h);
    } else if (type === "circle" && points?.length === 2) {
      const [start, end] = points;
      const radius = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      ctx.beginPath();
      ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
      fill ? ctx.fill() : ctx.stroke();
    } else if (type === "text" && text) {
      ctx.font = `${size || 16}px sans-serif`;
      ctx.fillStyle = color || "black";
      const lines = text.split("\n");
      lines.forEach((line, idx) => {
        ctx.fillText(line, x, y + (size || 16) + idx * (size || 16) * 1.2);
      });
    }
  };

  /* const redrawCanvas = (strokes) => {
    const ctx = contextRef.current;
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    strokes.forEach((s) => drawStroke(s, ctx));
  };*/

  const redrawCanvas = (strokes) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!ctx || !canvas) return;

    // Full wipe
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw strokes if any
    if (Array.isArray(strokes)) {
      strokes.forEach((s) => drawStroke(s, ctx));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1024;
    canvas.height = 690;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = ctx;

    const previewCanvas = previewCanvasRef.current;
    previewCanvas.width = 1024;
    previewCanvas.height = 690;
    previewCtxRef.current = previewCanvas.getContext("2d");

    const token = localStorage.getItem("token");
    if (!token || !user || !roomId) return;

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
        setMyStrokes(strokes.filter((s) => s.userId === user));
        setMyRedo([]);
        redrawCanvas(strokes);
      });

    socket.on("drawing", ({ stroke }) => {
      if (!stroke) return;
      setAllStrokes((prev) => {
        const updated = [...prev, stroke];
        redrawCanvas(updated);
        return updated;
      });
    });

    socket.on("drawing_deleted", (deletedId) => {
      setAllStrokes((prev) => {
        const updated = prev.filter((s) => s._id !== deletedId);
        redrawCanvas(updated);
        return updated;
      });
    });

    return () => {
      socket.off("drawing");
      socket.off("drawing_deleted");
    };
  }, [roomId, socket, user]);

  const clearPreview = () => {
    previewCtxRef.current?.clearRect(
      0,
      0,
      previewCanvasRef.current.width,
      previewCanvasRef.current.height
    );
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    isDrawing.current = true;
    startPos.current = { x: offsetX, y: offsetY };
    points.current = [{ x: offsetX, y: offsetY }];
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || tool === "text") return;
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
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

  const handleMouseUp = async (e) => {
    if (!isDrawing.current || tool === "text") return;
    isDrawing.current = false;
    clearPreview();

    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const finalPoint = { x: offsetX, y: offsetY };

    let stroke;
    if (tool === "pen" || tool === "eraser") {
      points.current.push(finalPoint);
      stroke = {
        type: tool,
        color: tool === "eraser" ? "#ffffff" : strokeColor,
        width: strokeWidth,
        points: [...points.current],
        userId: user,
      };
    } else {
      stroke = {
        type: tool,
        color: strokeColor,
        width: strokeWidth,
        fill,
        points: [startPos.current, finalPoint],
        userId: user,
      };
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/drawings",
        { roomId, strokeData: stroke },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const savedStroke = { ...stroke, _id: res.data._id };
      setAllStrokes((prev) => {
        const updated = [...prev, savedStroke];
        redrawCanvas(updated);
        return updated;
      });
      setMyStrokes((prev) => [...prev, savedStroke]);
      setMyRedo([]);
      socket.emit("drawing", { roomId, stroke: savedStroke });
    } catch (error) {
      console.error("Error saving stroke:", error);
    }

    points.current = [];
  };

  const handleUndo = useCallback(async () => {
    if (myStrokes.length === 0) return;
    const popped = myStrokes[myStrokes.length - 1];

    try {
      await axios.delete(`http://localhost:5000/api/drawings/${popped._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setMyStrokes((prev) => prev.slice(0, -1));
      setMyRedo((r) => [popped, ...r]);

      setAllStrokes((prev) => {
        const updated = prev.filter((s) => s._id !== popped._id);
        redrawCanvas(updated);
        return updated;
      });

      socket.emit("drawing_deleted", { roomId, strokeId: popped._id });
    } catch (error) {
      console.error("Error during undo:", error);
    }
  }, [myStrokes, roomId, socket]);

  const handleRedo = useCallback(async () => {
    if (myRedo.length === 0) return;
    const [restroke, ...rest] = myRedo;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/drawings",
        { roomId, strokeData: restroke },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const savedStroke = { ...restroke, _id: res.data._id };
      setAllStrokes((prev) => {
        const updated = [...prev, savedStroke];
        redrawCanvas(updated);
        return updated;
      });
      setMyStrokes((prev) => [...prev, savedStroke]);
      setMyRedo(rest);
      socket.emit("drawing", { roomId, stroke: savedStroke });
    } catch (error) {
      console.error("Error during redo:", error);
    }
  }, [myRedo, roomId, socket]);

  useEffect(() => {
    setUndoHandler(() => handleUndo);
    setRedoHandler(() => handleRedo);
  }, [handleUndo, handleRedo, setUndoHandler, setRedoHandler]);

  useEffect(() => {
    socket.on("canvas_cleared", () => {
      // Clear state
      setAllStrokes([]);
      setMyStrokes([]);
      setMyRedo([]);

      // Clear canvas context
      const ctx = contextRef.current;
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }

      // ✅ Force full redraw (empty strokes to ensure no stale state)
      redrawCanvas([]);
    });

    return () => {
      socket.off("canvas_cleared");
    };
  }, [socket]);

  return (
    <div className="flex-1 bg-white relative">
      <div className="relative" style={{ width: "1024px", height: "690px" }}>
        <canvas
          id="drawing-canvas" // ✅ Important for download
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ zIndex: 0 }}
        />
        <canvas
          ref={previewCanvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        />
        <div
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
          onClick={(e) => {
            if (tool === "text") {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              setTextInput({ x, y, value: "" });
            }
          }}
          onMouseDown={tool !== "text" ? handleMouseDown : undefined}
          onMouseMove={tool !== "text" ? handleMouseMove : undefined}
          onMouseUp={tool !== "text" ? handleMouseUp : undefined}
          onMouseLeave={tool !== "text" ? handleMouseUp : undefined}
        />
        {textInput && (
          <textarea
            autoFocus
            className="absolute z-50 bg-white text-black border border-gray-400 p-1 resize outline-none"
            style={{
              top: textInput.y,
              left: textInput.x,
              fontSize: `${strokeWidth * 4}px`,
              minWidth: "120px",
              minHeight: "40px",
              lineHeight: 1.2,
            }}
            value={textInput.value}
            onChange={(e) =>
              setTextInput((prev) => ({ ...prev, value: e.target.value }))
            }
            onBlur={async () => {
              if (!textInput.value.trim()) {
                setTextInput(null);
                return;
              }

              const stroke = {
                type: "text",
                text: textInput.value,
                x: textInput.x,
                y: textInput.y,
                size: strokeWidth * 4,
                color: strokeColor,
                userId: user,
              };

              drawStroke(stroke, contextRef.current);

              try {
                const res = await axios.post(
                  "http://localhost:5000/api/drawings",
                  { roomId, strokeData: stroke },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                const savedStroke = { ...stroke, _id: res.data._id };
                setAllStrokes((prev) => {
                  const updated = [...prev, savedStroke];
                  redrawCanvas(updated);
                  return updated;
                });
                setMyStrokes((prev) => [...prev, savedStroke]);
                setMyRedo([]);
                socket.emit("drawing", { roomId, stroke: savedStroke });
              } catch (err) {
                console.error("Error saving text stroke", err);
              }

              setTextInput(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.target.blur();
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DrawingPane;
