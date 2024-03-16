import { errorHandler } from "../utils/errorHandle.js"
import Post from "../models/Postmodel.js";
export const create=async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403,'You are not allowed to post'));
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(401,'Please enter all the details'));
    }
    const slug=req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'-');
    const newpost=new Post({
        ...req.body,
        slug,
        userId:req.user.id
    })
    try {
        const savedPost=await newpost.save();
        res.status(200).json(savedPost)
    } catch (error) {
        next(error);
    }
}