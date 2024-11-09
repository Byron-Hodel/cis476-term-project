import { Vault } from '../models/index.mjs';

// Controller to get all vault entries for a user
export const getUserVaultEntries = async (req, res) => {
    const { userId } = req.params;
  
    // Ensure the user ID in the token matches the requested user ID
    if (req.user.userId !== parseInt(userId, 10)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own vault data.',
      });
    }
  
    try {
      // Query the Vault table for all entries associated with the given user ID
      const vaultEntries = await Vault.findAll({
        where: {
          userId: userId,
        },
        attributes: ['vaultId', 'type', 'data', 'createdAt', 'updatedAt'],
      });
  
      // Send response if entries are found
      if (vaultEntries.length > 0) {
        res.status(200).json({
          success: true,
          data: vaultEntries,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'No vault entries found for this user.',
        });
      }
    } catch (error) {
      console.error('Error fetching vault data:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching the vault data.',
      });
    }
  };