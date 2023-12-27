const fs = require('fs');
const path = require('path');
const { rootDir } = require('../utils/path');
const productsFilePath = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {
  fs.readFile(productsFilePath, (err, data) => {
    if (!data || !data[0]) return callback([]);
    return err ? callback([]) : callback(JSON.parse(data));
  });
};

const writeProducts2File = (products) => {
  fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
    err ? console.log('one', err) : '';
  });
};

exports.Product = class Product {
  constructor({ title, description, price, image }) {
    this.title = title.trim();
    this.id = Math.floor(Math.random() * 10000) + '';
    this.image = image.trim();
    this.description = description.trim();
    this.price = price.trim();
  }

  save() {
    getProductsFromFile((products) => {
      products[products.length] = this;
      writeProducts2File(products);
    });
  }

  static getById(id, callback) {
    getProductsFromFile((products) => {
      callback(products.find((p) => p.id === id));
    });
  }

  static updateProduct({ id, title, image, description, price }, callback) {
    getProductsFromFile((products) => {
      let product = '';
      for (let i = 0; i < products.length; ++i) {
        if (products[i].id === id) {
          products[i] = {
            id: id,
            title: title.trim(),
            image: image.trim(),
            description: description.trim(),
            price: price.trim(),
          };
          product = products[i];
          writeProducts2File(products);
          break;
        }
      }
      callback(product);
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
};
