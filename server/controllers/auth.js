import User from '../models/Usermodels.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/errorHandle.js';
import jwt from 'jsonwebtoken';

export const signup=async(req,res,next)=>{
    const {username,email,password}=req.body;

    if(!username || !email || !password || username==='' || email==='' || password===''){
        next(errorHandler(400,'All entries are required'));
    }

    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser=new User({
        username,
        email,
        password:hashedPassword,
    })
    try {
        
        await newUser.save();
        res.json("Signup successful");
    } catch (error) {
        next(error);
    }
}

export const signin=async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password || email==='' || password===''){
        next(errorHandler(400,'All entries are required'));
    }
    try {
        const validUser=await User.findOne({email});
        if(!validUser){
            next(errorHandler(404,'User not found'));
        }
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(400,'Invalid Password'));
        }
        const token=jwt.sign(
            {
                id:validUser._id,
                isAdmin:validUser.isAdmin
            },
            process.env.JWT_TOKEN
        )


        const {password:pass,...rest}=validUser._doc;
        res.status(200).cookie('access_token',token).json(rest);
    } catch (error) {
        console.log("signin failed");
    }
}