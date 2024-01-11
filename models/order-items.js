const {sequelize} = require('../utils/database');
const { INTEGER } = require('sequelize');

const OrderItem = sequelize.define('OrderItem', {
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

module.exports = OrderItem;
