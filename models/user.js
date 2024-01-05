const {sequelize} = require('../utils/database');
const { STRING, INTEGER } = require('sequelize');

const User = sequelize.define('User', {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: STRING,
    allowNull: false,
  },
  lastName: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    validate: {
      isEmail: true,
    },
  },
});

module.exports = User;
