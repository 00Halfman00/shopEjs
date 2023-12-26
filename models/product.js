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
    getProductsFromFile(products => {   // products value becomes JSON.parse(data), which is an array that contains all the product-objects storred in file
      callback(products.find(p => p.id === id)); // callback has a parameter of an object which is what product.find returns and is used to render that data in getProduct
    });
  }

  static editProduct(){}

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
};

//////////////////////////////////  Pre-ES6 constructor fucntions which are now called classes with "synatactic sugar"
// const Product = (
//   function(){
//     function Product(title){
//       this.title = title;
//       this.save = function(){
//         products[products.length] = this;
//       }
//     }
//     return Product;
//   }()  //////////////////////// this line self invokes the function
// )
// Product.prototype.fetchAll = function(){
//   return products
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
