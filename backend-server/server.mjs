import express from 'express';
import cors from 'cors';
import db from './models/index.mjs';  // Import the default export
import userRoutes from './routes/userRoutes.mjs'

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

     // Middleware
     app.use(cors());
     app.use(express.json()); // Parse JSON requests
 
     // Use user routes
     app.use('/api/users', userRoutes);

    // Start server
    app.listen(4000, () => console.log("Server is running on port 4000"));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
