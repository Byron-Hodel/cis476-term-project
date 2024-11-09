import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Vault = sequelize.define('Vault', {
    vaultId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Ensure the table name matches your User model table name
        key: 'userId',
      },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM('Login', 'Credit Card', 'Identity', 'Secure Notes', 'Passport', 'License'),
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB, // Use JSONB for better performance and indexing
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  }, {
    tableName: 'Vault',
    timestamps: true,
  });

  // Optionally, define any associations here
  Vault.associate = (models) => {
    Vault.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return Vault;
};
