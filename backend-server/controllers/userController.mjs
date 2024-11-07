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
