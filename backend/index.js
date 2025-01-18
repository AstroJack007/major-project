const express = require('express');
const app = express();
const {connectDB} = require('./backend/src/lib/db.js');
const cookieparser = require("cookie-parser");
const authRoutes = require('./backend/src/routes/auth.js');
const cors = require('cors');
const msgRoutes = require('./backend/src/routes/message.js');
const path = require("path");

const port = process.env.PORT;
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use('/api/message', msgRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "frontend/my-project/dist")));
    
    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname, "frontend/my-project/dist/index.html"));
    });
}

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});


