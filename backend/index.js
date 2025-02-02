// filepath: /d:/code/web/New folder/major project/backend/index.js
const express = require('express');
const { app, server } = require('./src/lib/socket.js');
const dotenv = require('dotenv');
dotenv.config();
const { connectDB } = require('./src/lib/db.js');
const cookieparser = require("cookie-parser");
const authRoutes = require('./src/routes/auth.js');
const cors = require('cors');
const msgRoutes = require('./src/routes/message.js');
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 4000;

app.use(cookieparser());
app.use(cors({
    origin: "http://52.66.244.205",
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use('/api/message', msgRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/my-project/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/my-project", 'dist', 'index.html'));
    });
}

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});