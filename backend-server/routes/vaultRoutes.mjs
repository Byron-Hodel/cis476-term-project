import express from 'express';
import authenticateToken from '../middleware/authenticate.mjs'; // Ensure the path to your middleware is correct
import { getUserVaultEntries, addVaultEntry, updateVaultEntry } from '../controllers/vaultController.mjs'; // Ensure the path to your controller is correct

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

// Adding a route to add to the vault, protected by JWT
router.post('/add', authenticateToken, addVaultEntry);

// Adding a route for updating existing vault entries, protected by JWT
router.patch('/update/:vaultId', authenticateToken, updateVaultEntry);

export default router;
