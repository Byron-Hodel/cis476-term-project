const express = require('express');
const { sequelize } = require('./models');  // Database setup is managed in index.js

async function startServer() {
  try {
    console.log("Attempting to connect to the database...");
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Initialize Express app
    const app = express();

    // Middleware setup (if needed)
    // app.use(express.json());

    // Define your routes here, e.g., app.use('/api', apiRoutes);

    // Start server
    app.listen(4000, () => console.log("Server is running on port 4000"));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
