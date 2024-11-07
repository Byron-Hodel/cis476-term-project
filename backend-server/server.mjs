import express from 'express';
import cors from 'cors';
import db from './models/index.mjs';  // Import the default export

const { sequelize } = db;  // Destructure sequelize from the imported db object

async function startServer() {
  try {
    console.log("Attempting to connect to the database...");
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync database models with the database
    await sequelize.sync({ alter: true }); // Use { force: true } to drop tables and recreate them

    console.log("Database synchronized successfully.");

    // Initialize Express app
    const app = express();

    // Enable CORS with default settings
    app.use(cors());

    // Define your routes here, e.g., app.use('/api', apiRoutes);

    // Start server
    app.listen(4000, () => console.log("Server is running on port 4000"));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
