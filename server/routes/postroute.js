import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { errorHandler } from '../utils/errorHandle.js'
import { create,getposts } from '../controllers/post.js';

const router=express.Router();

router.post('/create',verifyToken,create);
router.get('/getposts',getposts);

export default router