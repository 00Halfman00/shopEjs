const db = require('../utils/database');

exports.Product = class Product {
  constructor({ title, description, price, image }) {
    this.title = title.trim();
    this.id = Math.floor(Math.random() * 10000) + '';
    this.image = image.trim();
    this.description = description.trim();
    this.price = price.trim();
  }
  /////////////////////////////   RETURN PROMISES AND HANDLE ASYNC ACTIONS IN CONTROLLERS
  save() {
    return db.execute(
      `INSERT INTO Products (title, image, description, price, quantity) VALUES("${this.title}", "${this.image}", "${this.description}", ${this.price}, 1)`
    );
  }

  static getById(id) {
    return db.query(`SELECT * FROM Products WHERE id = ${id};`);
  }

  static updateProduct({ id, title, image, description, price }) {
    return db.query(
      `UPDATE PRODUCTS SET title = "${title}", image = "${image}", description = "${description}", price = ${price} WHERE id = ${id}; `
    );
  }

  static deleteById(id) {
    return db.query(`DELETE from Products WHERE id = ${id};`);
  }

  static fetchAll() {
    return db.execute('select * from Products;');
  }
};
