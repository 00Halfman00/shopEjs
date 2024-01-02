const { sequelize } = require('../utils/database');
const { INTEGER } = require('sequelize');

const Cart = sequelize.define('Cart', {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
});
module.exports = Cart;
