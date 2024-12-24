const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const prisma=require('./db');
const connectDB=require('./lib/db');

const authRoutes=require('./routes/auth');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(("/api/auth"),authRoutes);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});

