const express=require('express');
const app=express();

const prisma=require('./db');

const authRoutes=require('./routes/auth');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(("/api/auth"),authRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}
);

