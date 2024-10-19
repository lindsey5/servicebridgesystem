import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

//Initialized a connection to a MySQL database using Sequelize.
const sequelize = new Sequelize(process.env.DB, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: 3306,
  logging: false,
});


// Function to test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connected to the database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export {sequelize, connectDB};