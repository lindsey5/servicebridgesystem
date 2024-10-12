import { Sequelize } from 'sequelize';

//Initialized a connection to a MySQL database using Sequelize.
const sequelize = new Sequelize('servicebridgesystem', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
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