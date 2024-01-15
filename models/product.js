const { BSON } = require('mongodb');
const { getDb } = require('../utils/database');

class Product {
  constructor(title, image, description, price, id) {
    (this.title = title),
      (this.image = image),
      (this.description = description),
      (this.price = price),
      (this._id = id);
  }

  save() {
    const db = getDb();
    return db
      .collection('products')
      .insertOne(this)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .catch((err) => console.log(err));
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new BSON.ObjectId(id) })
      .next()
      .then((p) => {
        return p;
      })
      .catch((err) => console.log(err));
  }

  static updateById(product) {
    const db = getDb();
    product._id  = new BSON.ObjectId(product._id);
    return db
      .collection('products')
      .updateOne({ _id: product._id }, { $set: product })
      .catch((err) => console.log(err));
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new BSON.ObjectId(productId) })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
