import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRoute from './routes/route.js'
import authRoute from './routes/authroute.js'
import postRoute from './routes/postroute.js'
import cookieParser from 'cookie-parser';
mongoose
    .connect(process.env.MONGO)
    .then(()=>{
        console.log("MongoDb is connected");
    })
    .catch((err)=>{
        console.log(err);
    });

const app=express();
const PORT=8000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'Internal server error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})

app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT} successfully`);
})