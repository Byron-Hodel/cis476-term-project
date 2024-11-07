import express from 'express';
import { signIn, signUp } from '../controllers/userController.mjs';

const router = express.Router();

// Route for user signup
router.post('/signup', signUp);

// Route for user sign in
router.post('/signin', signIn)

// You can add more routes here as needed
// e.g., router.put('/update', updateUserData);

export default router;
