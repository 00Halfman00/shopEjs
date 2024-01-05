const {sequelize} = require('../utils/database');
const { INTEGER } = require('sequelize');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: INTEGER,
  },
});

module.exports = CartItem;
