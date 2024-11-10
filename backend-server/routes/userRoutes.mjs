import express from 'express';
import { signIn, signUp, getSecurityQuestions, verifySecurityAnswers, changePassword } from '../controllers/userController.mjs';

const router = express.Router();

// Route for user signup
router.post('/signup', signUp);

// Route for user sign in
router.post('/signin', signIn);

// Route for getting security questions by email
router.post('/get-security-questions', getSecurityQuestions);

// Route for receiving security questions from the user that forgot their password
router.post('/verify-security-answers', verifySecurityAnswers);

// Route for changing a users password
router.post('/change-password', changePassword);

export default router;
