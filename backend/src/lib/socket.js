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
    console.log("User ID from handshake:", userId);
    console.log("Full handshake query:", socket.handshake.query);
    
    if (userId && userId !== 'undefined') {
        userSocketMap[userId] = socket.id;
        const onlineUserIds = Object.keys(userSocketMap);
        console.log("Online users to emit:", onlineUserIds);
        io.emit("getOnlineUser", onlineUserIds);
    } else {
        console.log("WARNING: No valid userId in socket connection!");
    }
    
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            const onlineUserIds = Object.keys(userSocketMap);
            console.log("Online users after disconnect:", onlineUserIds);
            io.emit("getOnlineUser", onlineUserIds);
        }
    });
});

function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

module.exports = { io, app, server, getReceiverSocketId };