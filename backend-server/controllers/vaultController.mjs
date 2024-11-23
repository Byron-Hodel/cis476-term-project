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

// Adding a way to update existing vault entries
export const updateVaultEntry = async (req, res) => {
  const { vaultId } = req.params; // Get vaultId from URL parameters
  const { updatedData } = req.body; // Extract updatedData from request body

  // Validate input
  if (!updatedData) {
    return res.status(400).json({
      success: false,
      message: '"updatedData" is required.',
    });
  }

  try {
    // Fetch the vault entry by its primary key
    const vaultEntry = await Vault.findByPk(vaultId);

    // Check if the entry exists and belongs to the authenticated user
    if (!vaultEntry || vaultEntry.userId !== req.user.userId) {
      return res.status(404).json({
        success: false,
        message: 'Vault entry not found or access denied.',
      });
    }

    // Ensure `data` is handled as an object
    let existingData = vaultEntry.data;

    // If `data` is incorrectly stored as a string, parse it
    if (typeof existingData === 'string') {
      try {
        existingData = JSON.parse(existingData);
      } catch (error) {
        console.error('Failed to parse existing data:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to parse existing vault data.',
        });
      }
    }

    // Merge the existing data with the updated data
    const updatedEntry = { ...existingData, ...updatedData };

    // Save the updated data back to the database
    vaultEntry.data = updatedEntry; // Sequelize handles JSONB directly
    await vaultEntry.save();

    // Prepare the response
    res.status(200).json({
      success: true,
      message: 'Vault entry updated successfully.',
      data: {
        vaultId: vaultEntry.vaultId,
        userId: vaultEntry.userId,
        type: vaultEntry.type,
        data: updatedEntry, // Ensure it's sent as a proper object
        createdAt: vaultEntry.createdAt,
        updatedAt: vaultEntry.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating vault entry:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the vault entry.',
    });
  }
};

// Adding function to delete a entry from the vault
export const deleteVaultEntry = async (req, res) => {
  const { vaultId } = req.params;

  try {
    // Fetch the vault entry by its primary key
    const vaultEntry = await Vault.findByPk(vaultId);

    // Check if the entry exists and belongs to the authenticated user
    if (!vaultEntry || vaultEntry.userId !== req.user.userId) {
      return res.status(404).json({
        success: false,
        message: 'Vault entry not found or access denied.',
      });
    }

    // Delete the entry
    await vaultEntry.destroy();

    // send a success response
    res.status(200).json({
      success: true,
      message: 'Vault entry deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting vault entry:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the vault entry.',
    });
  }
};
