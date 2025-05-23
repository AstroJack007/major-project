const { Server } = require("socket.io");
const http = require('http');
const express = require('express');
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    },
    allowEIO3: true,
    transports: ['websocket', 'polling']
});

const userSocketMap = {};

io.on('connection', (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
    
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUser", Object.keys(userSocketMap));
        }
    });
});

function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

module.exports = { io, app, server, getReceiverSocketId };