import User from "../models/Usermodels.js";
import { errorHandler } from "../utils/errorHandle.js";
import bcryptjs from 'bcryptjs'
export const test=(req,res)=>{
    res.json({message:"API TEST SUCCESSFUL"});
}

export const updateUser=async(req,res,next)=>{
    if(req.user.id!==req.params.userId){
        return next(errorHandler(403,'You are not allowed to update'));
    }
    if(req.body.password){
        if(req.body.password<6){
            return next(errorHandler(403,'Password must be atleast 6 characters'));
        }
        if(req.body.password>20){
            return next(errorHandler(403,'Password cannot contain more than 20 characters'));
        }
        req.body.password=bcryptjs.hashSync(req.body.password,10);
    }
    if(req.body.username){
        if(req.body.username.length<5 || req.body.username.length>20){
            return next(errorHandler(403,'Username must be between 5 and 20 characters'));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(403,'Username cannot contain spaces'));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(403,'Choose any other username'));
        }
    }
    try {
        const updatedUser=await User.findByIdAndUpdate(req.params.userId,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
            }
        },{new:true});
        const {password, ...rest}=updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const deleteUser=async(req,res,next)=>{
    if(req.user.id!==req.params.userId){
        return next(errorHandler(403,'You are not allowed to delete'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(error);
    }
}

export const signout=(req,res,next)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json('You have logged out')
    } catch (error) {
        next(error);
    }
}