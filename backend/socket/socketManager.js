// socket/socketManager.js
const { v4: uuidv4 } = require('uuid');
const Room = require('../models/Room');
const drawingHandler = require('./handlers/drawingHandler');
const roomHandler = require('./handlers/roomHandler');
const userHandler = require('./handlers/userHandler');

class SocketManager {
  constructor() {
    this.connectedUsers = new Map();
    this.roomUsers = new Map();
    this.userRooms = new Map();
  }

  init(io) {
    this.io = io;

    io.on('connection', (socket) => {
      console.log(`👤 User connected: ${socket.id}`);
      this.setupSocketHandlers(socket);
    });

    setInterval(() => {
      this.cleanupInactiveRooms();
    }, 60 * 60 * 1000);
  }

  setupSocketHandlers(socket) {
    socket.on('user:join', (userData) => this.handleUserJoin(socket, userData));
    socket.on('user:leave', () => this.handleUserLeave(socket));

    socket.on('room:join', (data) => roomHandler.handleJoinRoom(socket, data, this));
    socket.on('room:leave', (data) => roomHandler.handleLeaveRoom(socket, data, this));
    socket.on('room:create', (data) => roomHandler.handleCreateRoom(socket, data, this));

    socket.on('drawing:start', (data) => drawingHandler.handleDrawingStart(socket, data, this));
    socket.on('drawing:draw', (data) => drawingHandler.handleDrawing(socket, data, this));
    socket.on('drawing:end', (data) => drawingHandler.handleDrawingEnd(socket, data, this));
    socket.on('drawing:clear', (data) => drawingHandler.handleClearCanvas(socket, data, this));
    socket.on('drawing:undo', (data) => drawingHandler.handleUndo(socket, data, this));
    socket.on('drawing:redo', (data) => drawingHandler.handleRedo(socket, data, this));

    socket.on('canvas:save', (data) => this.handleCanvasSave(socket, data));
    socket.on('canvas:load', (data) => this.handleCanvasLoad(socket, data));

    socket.on('chat:message', (data) => this.handleChatMessage(socket, data));
    socket.on('cursor:move', (data) => this.handleCursorMove(socket, data));

    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  handleUserJoin(socket, userData) {
    const user = {
      id: userData.id || uuidv4(),
      username: userData.username || `User${Math.floor(Math.random() * 1000)}`,
      color: userData.color || this.generateRandomColor(),
      joinedAt: new Date()
    };

    this.connectedUsers.set(socket.id, user);
    socket.emit('user:joined', user);
    console.log(`👤 User joined: ${user.username} (${socket.id})`);
  }

  handleUserLeave(socket) {
    const user = this.connectedUsers.get(socket.id);
    if (user) {
      this.removeUserFromRoom(socket);
      this.connectedUsers.delete(socket.id);
      console.log(`👤 User left: ${user.username} (${socket.id})`);
    }
  }

  handleCanvasSave(socket, { roomId, canvasData }) {
    const user = this.connectedUsers.get(socket.id);
    if (!user || !roomId) return;

    Room.findOne({ roomId })
      .then(room => {
        if (room) {
          room.canvasData = canvasData;
          return room.save();
        }
      })
      .then(() => {
        socket.emit('canvas:saved', { success: true });
      })
      .catch(error => {
        console.error('Canvas save error:', error);
        socket.emit('canvas:saved', { success: false, error: error.message });
      });
  }

  handleCanvasLoad(socket, { roomId }) {
    Room.findOne({ roomId })
      .then(room => {
        if (room) {
          socket.emit('canvas:loaded', {
            canvasData: room.canvasData || null,
            drawingHistory: room.drawingHistory?.slice(-100) || []
          });
        } else {
          socket.emit('canvas:loaded', { canvasData: null, drawingHistory: [] });
        }
      })
      .catch(error => {
        console.error('Canvas load error:', error);
        socket.emit('canvas:loaded', { error: error.message });
      });
  }

  handleChatMessage(socket, { roomId, message }) {
    const user = this.connectedUsers.get(socket.id);
    if (!user || !roomId || !message?.trim()) return;

    const chatMessage = {
      id: uuidv4(),
      userId: user.id,
      username: user.username,
      message: message.trim(),
      timestamp: new Date()
    };

    this.broadcastToRoom(roomId, 'chat:message', chatMessage, socket.id);
  }

  handleCursorMove(socket, { roomId, x, y }) {
    const user = this.connectedUsers.get(socket.id);
    if (!user || !roomId) return;

    const cursorData = { userId: user.id, username: user.username, x, y, color: user.color };
    this.broadcastToRoom(roomId, 'cursor:move', cursorData, socket.id);
  }

  handleDisconnect(socket) {
    this.removeUserFromRoom(socket);
    this.connectedUsers.delete(socket.id);
    console.log(`👤 User disconnected: ${socket.id}`);
  }

  addUserToRoom(socketId, roomId) {
    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set());
    }
    this.roomUsers.get(roomId).add(socketId);
    this.userRooms.set(socketId, roomId);
  }

  removeUserFromRoom(socket) {
    const roomId = this.userRooms.get(socket.id);
    if (roomId) {
      const roomUsers = this.roomUsers.get(roomId);
      if (roomUsers) {
        roomUsers.delete(socket.id);
        if (roomUsers.size === 0) {
          this.roomUsers.delete(roomId);
        }
      }
      this.userRooms.delete(socket.id);

      const user = this.connectedUsers.get(socket.id);
      if (user) {
        this.broadcastToRoom(roomId, 'user:left', {
          userId: user.id,
          username: user.username
        }, socket.id);
      }
    }
  }

  broadcastToRoom(roomId, event, data, excludeSocketId = null) {
    const roomUsers = this.roomUsers.get(roomId);
    if (roomUsers) {
      roomUsers.forEach(socketId => {
        if (socketId !== excludeSocketId) {
          const socket = this.io.sockets.sockets.get(socketId);
          if (socket) {
            socket.emit(event, data);
          }
        }
      });
    }
  }

  getRoomUsers(roomId) {
    const roomUsers = this.roomUsers.get(roomId);
    if (!roomUsers) return [];

    return Array.from(roomUsers).map(socketId => this.connectedUsers.get(socketId)).filter(Boolean);
  }

  generateRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  async cleanupInactiveRooms() {
    try {
      await Room.cleanupInactiveRooms(7);
      console.log('🧹 Cleaned up inactive rooms');
    } catch (error) {
      console.error('Error cleaning up rooms:', error);
    }
  }
}

const socketManager = new SocketManager();

module.exports = (io) => {
  socketManager.init(io);
  return socketManager;
};
