const express = require('express');
const {app, server} = require('./src/lib/socket.js');
const dotenv = require('dotenv');
const {connectDB} = require('./src/lib/db.js');
const cookieparser = require("cookie-parser");
const authRoutes = require('./src/routes/auth.js');
const cors = require('cors');
const msgRoutes = require('./src/routes/message.js');
const path = require("path");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use('/api/message', msgRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(path.resolve(), "../frontend/my-project/dist")));

    app.get("*", (req,res) => {
        res.sendFile(path.join(path.resolve(), "../frontend/my-project/dist/index.html"));
    });
}

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});
