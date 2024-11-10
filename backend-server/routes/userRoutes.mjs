import express from 'express';
import { signIn, signUp, getSecurityQuestions, verifySecurityAnswers } from '../controllers/userController.mjs';

const router = express.Router();

// Route for user signup
router.post('/signup', signUp);

// Route for user sign in
router.post('/signin', signIn)

// Route for getting security questions by email
router.post('/get-security-questions', getSecurityQuestions)

// Route for receiving security questions from the user that forgot their password
router.post('/verify-security-answers', verifySecurityAnswers)

// You can add more routes here as needed
// e.g., router.put('/update', updateUserData);

export default router;
