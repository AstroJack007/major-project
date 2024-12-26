const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const connectDB=require('./src/lib/db.js');
const cookieparser=require("cookie-parser");
const authRoutes=require('./src/routes/auth.js');
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieparser());
app.use(("/api/auth"),authRoutes);


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});

 
