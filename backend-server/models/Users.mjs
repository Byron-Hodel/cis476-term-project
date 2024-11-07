import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    securityQuestion1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    securityAnswer1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    securityQuestion2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    securityAnswer2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    securityQuestion3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    securityAnswer3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Users',
    timestamps: true,
  });

  return User;
};
