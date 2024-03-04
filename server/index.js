import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

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

app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT} successfully`);
})