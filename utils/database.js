const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  }
);

  const db = new Promise((res, rej) =>{
    if(true){
      res(
        sequelize
        .authenticate()
        .then(() => {
          const Product = require('../models/product');
          const User = require('../models/user');
          const Cart = require('../models/cart')
          const CartItem = require('../models/cart-item');
          Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}); // getUser, setUser, createUser
          User.hasMany(Product);// getProducts, countProducts, hasProduct, setProuducts, addProduct, removeProduct, createProduct
          User.hasOne(Cart);    // getCart, setCart, createCart
          Cart.belongsTo(User); // getUser, setUser, createUser
          Cart.belongsToMany(Product, {through: CartItem});//getProducts, countProducts, hasProduct, setProuducts, addProduct, removeProduct, createProduct
          Product.belongsToMany(Cart, {through: CartItem});//getCart, countCart, hasCart, setCart, addCart, removeProduct, createProduct
        })
        .then(() => {
          const User = require('../models/user');
          console.log('SEQUELIZE IS UP AND RUNNING');
          sequelize.sync();
          return User.findByPk(1);
        })
        .then((user) => {
          const User = require('../models/user');
           if(!user){
            return User.create({
              firstName: 'John',
              lastName: 'Rambo',
              email: '00johnrambo00@something.com',
            });
           }
           return user;
        })
        .then((user) => user.createCart())
        .catch((err) => (err ? console.log('SEQUELIZE IS BROKEN', err) : ''))
      )
    } else {
      rej(console.log('rejected'))
    }
  })



module.exports = {db, sequelize};
