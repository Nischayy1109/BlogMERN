import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { errorHandler } from '../utils/errorHandle.js'
import { create } from '../controllers/post.js';

const router=express.Router();

router.post('/create',verifyToken,create);

export default router