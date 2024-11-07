import express from 'express';
import userRoutes from './userRoutes.mjs'; 


const router = express.Router();

// Use routes
router.use('/users', userRoutes);


export default router;
