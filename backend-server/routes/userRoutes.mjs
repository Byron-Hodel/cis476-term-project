import express from 'express';
import { signUp } from '../controllers/userController.mjs';

const router = express.Router();

// Route for user signup
router.post('/signup', signUp);

// You can add more routes here as needed
// e.g., router.post('/signin', signIn);
// e.g., router.put('/update', updateUserData);

export default router;
