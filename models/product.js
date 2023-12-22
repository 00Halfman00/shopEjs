const fs = require('fs');
const path = require('path');
const { rootDir } = require('../utils/path');
const productsFilePath = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {
  fs.readFile(productsFilePath, (err, data) => {
    return err ? callback([]) : callback(JSON.parse(data));
  });
};

exports.Product = class Product {
  constructor({title, description, price, image}) {
    this.title = title;
    this.id = Math.floor(Math.random() * 10000) + '';
    this.image = image;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products)=> {
      products[products.length] = this;
      fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
        err ? console.log('one', err) : ''
      });
    })
  }

  static getById(id, callback){
    getProductsFromFile(products => {
      callback(products.find(p => p.id === id));
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
};
