import 'dotenv/config';  // Load environment variables from .env
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const db = {};

// Set up Sequelize instance using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // This setting is sometimes needed for RDS
      }
    }
  }
);

// Dynamically import all model files
const modelFiles = fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-4) === '.mjs');

for (const file of modelFiles) {
  const model = await import(path.join(__dirname, file));
  const initializedModel = model.default(sequelize, Sequelize.DataTypes);
  db[initializedModel.name] = initializedModel;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object as default for ES module compatibility
export default db;
