const {sequelize} = require('../utils/database');
const { STRING, INTEGER, DECIMAL } = require('sequelize');

const Product = sequelize.define('Product', {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  title: { type: STRING, allowNull: false },
  image: {
    type: STRING,
    validate: {
      isUrl: true,
    },
    allowNull: false,
  },
  description: { type: STRING, allowNull: false },
  price: { type: DECIMAL(10, 2), allowNull: false },
});

module.exports = Product;
