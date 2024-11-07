import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticateToken = (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // extract the token part after "Bearer"

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify the token using the secret key
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) {
                console.log('Token verifcation failed: ', err.message);
                return res.status(403).json({ message: 'Access denied. Invalid token.' });
            }

            // If token is valid, attach the user data to the request object
            req.user = user;
            console.log('Token verified successfully:', user);

            // Move to the next middleware or route handler
            next();
        });
    } catch (error) {
        console.err('Error in authentication middleware:', error);
        res.status(500).json({ message: 'Internal server error during authentication'});
    }
};

export default authenticateToken;

// Example of how to use this, put the authenticate in the route file itself calling the controller you want too handle the api call, like with signup and sign in
/*
import { signUp, signIn } from '../controllers/userController.mjs'; // example of functions from a controller
import authenticateToken from '../middlewares/authenticateToken.mjs'; // Import middleware

// Protected routes (example)
router.get("/profile", authenticateToken, {function from a controller});
*/