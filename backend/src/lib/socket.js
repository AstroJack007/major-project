const { Server } = require("socket.io");
const http = require('http');
const express = require('express');
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://52.66.244.205", "http://52.66.244.205:3000"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Range", "X-Content-Range"]
    },
    allowEIO3: true,
    transports: ['websocket', 'polling']
});

// ...existing code...
 function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }
const userSocketMap ={};
io.on('connection', (socket) => {
    console.log("A user connected", socket.id);
    const userId =socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
    }
    io.emit("getOnlineUser",Object.keys(userSocketMap))
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUser",Object.keys(userSocketMap));
    });
});

module.exports = { io, app, server ,getReceiverSocketId};