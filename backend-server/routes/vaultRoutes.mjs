import express from 'express';
import authenticateToken from '../middleware/authenticate.mjs'; // Ensure the path to your middleware is correct
import { getUserVaultEntries } from '../controllers/vaultController.mjs'; // Ensure the path to your controller is correct

const router = express.Router();

// test route
router.get('/test', (req, res) => {
    res.status(200).send('Test route is working!');
  });

// Test route for middleware
router.get('/test-auth', authenticateToken, (req, res) => {
    // Respond with the user data from the JWT
    res.status(200).json({
        success: true,
        message: 'Middleware authentication passed!',
        user: req.user, // Return the decoded user for verification
    });
});


// Route to get all vault entries for a specific user, protected by JWT
router.get('/:userId', authenticateToken, getUserVaultEntries); // Simplified the route path

// You can add more vault-related routes here if needed
// e.g., router.post('/add', authenticateToken, addVaultEntry);

export default router;
