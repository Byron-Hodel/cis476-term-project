import bcrypt from 'bcryptjs';
import { User } from '../models/index.mjs';
import jwt from 'jsonwebtoken';

// Secret key for signing JWTs
const JWT_SECRET = process.env.JWT_SECRET; 

// Sign up function
export const signUp = async (req, res) => {
  const { name, email, password, active, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2, securityQuestion3, securityAnswer3 } = req.body;

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      active: active !== undefined ? active : true,  // Ensure the 'active' field defaults to true
      securityQuestion1,
      securityAnswer1,
      securityQuestion2,
      securityAnswer2,
      securityQuestion3,
      securityAnswer3,
    });

    res.status(201).json({ message: "User registered successfully", userId: newUser.userId });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Sign in function
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Searching for user in the database...');
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('User not found:', { email });
      return res.status(400).json({ message: 'Invalid email or password'});
    }
    console.log('User found:', { userId: user.userId, email: user.email });

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password comparison failed for user:', { userId: user.userId });
      return res.status(400).json({ message: 'Invalid email or password'});
    }
    console.log('Password comparison successful for user:', { userId: user.userId });

    console.log('Generating JWT token...');
    const token = jwt.sign({
      userId: user.userId,
      email: user.email,
      // Inlcude any other user information needed in the token payload here
    },
    JWT_SECRET,
    { expiresIn: '24h'} // Token expires in 24 hours
    );
    console.log('JWT token generated successfully for user:', { userId: user.userId });

    res.status(200).json({
      message: 'Sign-in successful',
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        // Incude any other information wanting to send to user
      },
    });
    console.log('Sign-in response sent for user:', { userId: user.userId });
  } catch (error){
    console.error('Error during sign-in: ', error);
    res.status(500).json({ message: 'Backend server error'});
  }
};

// Function to retrieve security questions by email
export const getSecurityQuestions = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Find the user by email, only selecting the security questions
    const user = await User.findOne({
      where: { email },
      attributes: ['securityQuestion1', 'securityQuestion2', 'securityQuestion3'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Gather the security questions in an array
    const questions = [
      { question: user.securityQuestion1 },
      { question: user.securityQuestion2 },
      { question: user.securityQuestion3 },
    ];

    // Fisher-Yates shuffle algorithm for better randomization
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    // Send only the randomized questions
    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error fetching security questions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const verifySecurityAnswers = async (req, res) => {
  const { email, answers } = req.body;

  if (!email || !Array.isArray(answers) || answers.length !== 3) {
    return res.status(400).json({ message: 'Email and exactly 3 answers are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({
      where: { email },
      attributes: ['securityQuestion1', 'securityAnswer1', 'securityQuestion2', 'securityAnswer2', 'securityQuestion3', 'securityAnswer3'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a mapping of stored questions and answers
    const storedAnswers = [
      { question: user.securityQuestion1, answer: user.securityAnswer1 },
      { question: user.securityQuestion2, answer: user.securityAnswer2 },
      { question: user.securityQuestion3, answer: user.securityAnswer3 },
    ];

    // Validate each submitted answer by direct comparison
    const isAllCorrect = answers.every((submittedAnswer) => {
      const matchedStoredAnswer = storedAnswers.find(
        (stored) => stored.question === submittedAnswer.question
      );
      return matchedStoredAnswer && matchedStoredAnswer.answer === submittedAnswer.answer;
    });

    if (isAllCorrect) {
      return res.status(200).json({ message: 'All answers verified successfully' });
    } else {
      return res.status(401).json({ message: 'Security answers do not match' });
    }
  } catch (error) {
    console.error('Error verifying security answers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to change a users password
export const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email }, attributes: ['userId'] });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.update({ password: hashedPassword }, { where: { email } });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};