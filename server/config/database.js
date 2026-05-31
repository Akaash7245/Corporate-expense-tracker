const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
      },
    })
  : new Sequelize({
      dialect: process.env.DB_DIALECT || 'sqlite',
      storage: process.env.DB_STORAGE || './database.sqlite',
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
      },
    });

module.exports = sequelize;
