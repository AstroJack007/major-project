const express=require('express');
const {app,server}=require('./src/lib/socket.js');
const dotenv=require('dotenv');
dotenv.config();
const {connectDB}=require('./src/lib/db.js');
const cookieparser=require("cookie-parser");
const authRoutes=require('./src/routes/auth.js');
const cors=require('cors');
const msgRoutes=require('./src/routes/message.js');
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const port = process.env.PORT || 3000; 

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}
))
app.use(("/api/auth"),authRoutes);
app.use('/api/message',msgRoutes);

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});

 
