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

// Adding a way to add to the vault
export const addVaultEntry = async (req, res) => {
  const { type, data } = req.body; // Extracting type and data from the request body
  const userId = req.user.userId; // Extract user ID from the authenticated user token

  // validate input
  if (!type || !data) {
    return res.status(400).json({
      success: false,
      message: 'Both "type" and "data" fields are required.'
    });
  }

  try {
    // create a new entry in the vault table
    const newVaultEntry = await Vault.create({
      userId,
      type,
      data,
    });

    res.status(201).json({
      success: true,
      message: 'Vault entry created successfully.',
      data: newVaultEntry,
    });
  } catch (error){
    console.error('Error adding vault entry:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding the vault entry.',
    });
  }
};