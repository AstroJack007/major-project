const express = require('express');
const { app, server } = require('./src/lib/socket.js');
const dotenv = require('dotenv');
const { connectDB } = require('./src/lib/db.js');
const cookieparser = require("cookie-parser");
const authRoutes = require('./src/routes/auth.js');
const cors = require('cors');
const msgRoutes = require('./src/routes/message.js');
const path = require("path");
const fs = require('fs');
const https = require('https');

dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://65.1.130.1', 'http://localhost:5173']
        : 'http://localhost:5173',
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use('/api/message', msgRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/my-project/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/my-project/dist/index.html"));
    });
}

const sslOptions = {
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.cert')
};

https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
    connectDB();
});
