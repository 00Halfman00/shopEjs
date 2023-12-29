const path = require('path');
const fs = require('fs');

const { Product } = require('./product');
const { rootDir } = require('../utils/path');
const cartFilePath = path.join(rootDir, 'data', 'cart.json');

const readCartFile = (callback) => {
  fs.readFile(cartFilePath, (err, data) => {
    if (!data || !data[0]) return callback([{ products: [], total: 0 }]);
    return err ? callback([]) : callback(JSON.parse(data));
  });
};

const writeCartFile = (payload) => {
  fs.writeFile(cartFilePath, JSON.stringify(payload), (err) => {
    err ? console.log(err) : '';
  });
};

exports.Cart = class Cart {
  ////////////////////////////////////////////////////////    CALLSTACK OF HELL!!!!!    //////////////////////
  static add2Cart(productId, callback) {
    callback(
      Product.getById(productId, (product) => {
        readCartFile((cart) => {
          let notInCart = 0;
          if (cart[0].products[0]) {
            for (let i = 0; i < cart[0].products.length; ++i) {
              if (productId === cart[0].products[i].id) {
                cart[0].total = +cart[0].total + +cart[0].products[i].price;
                notInCart++;
                cart[0].products[i].quantity =
                  +cart[0].products[i].quantity + 1;
                break;
              }
            }
          }
          if (!cart[0].products[0] || !notInCart) {
            cart[0].products[cart[0].products.length] = {
              ...product,
              quantity: 1,
            };
            cart[0].total = +cart[0].total + +product.price;
          }
          writeCartFile(cart); // shooting off seven functions just to read cart, do the math and write to cart
        });
      })
    );
  }

  static removeFromCart(productId, callback) {
    let tmpCart = '';
    readCartFile((cart) => {
      const tmp = [];
      for (let i = 0; i < cart[0].products.length; ++i) {
        if (cart[0].products[i].id !== productId) {
          tmp[tmp.length] = cart[0].products[i];
        } else {
          cart[0].total -=
            cart[0].products[i].price * cart[0].products[i].quantity;
        }
      }
      cart[0].products = tmp;
      callback(cart, writeCartFile(cart));
    });
  }

  static getCart(callback) {
    readCartFile(callback);
  }
};
