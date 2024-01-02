const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
let cart = '';

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('SEQUELIZE IS UP AND RUNNING');
    sequelize.sync();
  })
  .then(async() => {
    const Product = require('../models/product');
    const Cart = require('../models/cart')
    Cart.hasMany(Product);
    Product.belongsTo(Cart);
    cart = await Cart.create();
  })
  .catch((err) => (err ? console.log('SEQUELIZE IS BROKEN') : ''));


module.exports = {sequelize, cart};
