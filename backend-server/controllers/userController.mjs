import bcrypt from 'bcryptjs';
import { User } from '../models/index.mjs';

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
