// models/index.js
import fs from 'fs'
import {Sequelize} from 'sequelize';

const dbPassword = process.env.DB_PASSWORD_FILE
  ? fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8').trim()
  : process.env.DB_PASSWORD;


console.log("DB_PASSWORD =", dbPassword); 

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  dbPassword,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

export default sequelize;

