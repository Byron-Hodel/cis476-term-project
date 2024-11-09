import express from 'express';
import userRoutes from './userRoutes.mjs'; 
import vaultRoutes from './vaultRoutes.mjs';

const router = express.Router();

// Use routes
router.use('/users', userRoutes);
router.use('/vault', vaultRoutes);


export default router;
