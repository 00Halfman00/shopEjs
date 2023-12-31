const db = require('../utils/database');

exports.Product = class Product {
  constructor({ title, description, price, image }) {
    this.title = title.trim();
    this.id = Math.floor(Math.random() * 10000) + '';
    this.image = image.trim();
    this.description = description.trim();
    this.price = price.trim();
  }

  save() {
    //////////////////  ADD A PRODUCT WITH MYSQL (WRITE)
    db.execute(
      `INSERT INTO Products (title, image, description, price, quantity) VALUES("${this.title}", "${this.image}", "${this.description}", ${this.price}, 1)`
    ).catch((err) => (err ? console.log(err) : ''));
  }

  static getById(id, callback) {
    //////////////////////////// GET A PRODUCT WITH MYSQL (READ)
    db.query(`SELECT * FROM Products WHERE id = ${id};`)
      .then((resolve) => callback(resolve[0][0]))
      .catch((err) => console.log('err: ', err));
  }

  static updateProduct({ id, title, image, description, price }, callback) {
    ////////////////     UPDATE A PRODUCT WITH MYSQL (EDIT)
    db.query(
      `UPDATE PRODUCTS SET title = "${title}", image = "${image}", description = "${description}", price = ${price} WHERE id = ${id}; `
    )
      .then((resolve) => db.query(`SELECT * FROM Products WHERE id = ${id};`))
      .then((resolve) => callback(resolve[0][0]))
      .catch((err) => (err ? console.log(err) : ''));
  }

  static fetchAll(id, callback) {
    ///////  IF ID, REMOVE THAT PRODUCT (DELETE) THEN GET ALL PRODUCTS (READ)   or   GET ALL PRODUCTS WITH MYSQL (READ)
    if (id) {
      db.query(`DELETE from Products WHERE id = ${id};`);
      db.query('select * from Products;')
        .then((resolve) => callback(resolve[0]))
        .catch((err) => console.log(err));
    } else {
      db.query('select * from Products;')
        .then((resolve) => callback(resolve[0]))
        .catch((err) => console.log(err));
    }
  }
};

// const fs = require('fs');
// const path = require('path');
// const { rootDir } = require('../utils/path');
// const productsFilePath = path.join(rootDir, 'data', 'products.json');

// const getProductsFromFile = (callback) => {
//   fs.readFile(productsFilePath, (err, data) => {
//     if (!data || !data[0]) return callback([]);
//     return err ? callback([]) : callback(JSON.parse(data));
//   });
// };

// const writeProducts2File = (products) => {
//   fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
//     err ? console.log('one', err) : '';
//   });
// };

// exports.Product = class Product {
//   constructor({ title, description, price, image }) {
//     this.title = title.trim();
//     this.id = Math.floor(Math.random() * 10000) + '';
//     this.image = image.trim();
//     this.description = description.trim();
//     this.price = price.trim();
//   }

//   save() {
//     getProductsFromFile((products) => {
//       products[products.length] = this;
//       writeProducts2File(products);
//     });
//   }

//   static getById(id, callback) {
//     getProductsFromFile((products) => {
//       callback(products.find((p) => p.id === id));
//     });
//   }

//   static updateProduct({ id, title, image, description, price }, callback) {
//     getProductsFromFile((products) => {
//       let product = '';
//       for (let i = 0; i < products.length; ++i) {
//         if (products[i].id === id) {
//           products[i] = {
//             id: id,
//             title: title.trim(),
//             image: image.trim(),
//             description: description.trim(),
//             price: price.trim(),
//           };
//           product = products[i];
//           writeProducts2File(products);
//           break;
//         }
//       }
//       callback(product);
//     });
//   }

//   static fetchAll(id, callback) {
//     getProductsFromFile((products) => {
//       if (id) {
//         products = products.filter((p) => p.id !== id) || [];
//         callback(products);
//         writeProducts2File(products);
//       } else {
//         callback(products);
//       }
//     });
//   }
// };
