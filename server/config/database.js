const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = sequelize;
