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
const path=require("path");

const port = process.env.PORT || 3000; 


app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin:"http://3.110.88.37:3000",
    credentials:true,
}
))
app.use(("/api/auth"),authRoutes);
app.use('/api/message',msgRoutes);

if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,"../frontend/my-project/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/my-project",'dist','index.html'))
    })

}

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});

 
