const express = require('express');
const { app, server } = require('./src/lib/socket.js');
const dotenv = require('dotenv');
const { connectDB } = require('./src/lib/db.js');
const cookieparser = require("cookie-parser");
const authRoutes = require('./src/routes/auth.js');
const cors = require('cors');
const msgRoutes = require('./src/routes/message.js');
const path = require("path");

dotenv.config();

const port = process.env.PORT;

app.use(express.json());
app.use(cookieparser());
app.use(
    cors({
        origin: process.env.NODE_ENV === "production" 
            ? ["https://major-project-3-s45v.onrender.com", "http://localhost:5173"]
            : "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
        exposedHeaders: ["Set-Cookie"]
    })
);

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} `);
    next();
});

app.use("/api/auth", authRoutes);
app.use('/api/message', msgRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(path.resolve(), "../frontend/my-project/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(path.resolve(), "../frontend/my-project/dist/index.html"));
    });
}

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});