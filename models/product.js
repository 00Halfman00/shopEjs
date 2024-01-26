const mongoose = require('mongoose'), Schema = mongoose.Schema;

const pSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', pSchema);






























// const { BSON } = require('mongodb');
// const { getDb } = require('../utils/database');

// class Product {
//   constructor(title, image, description, price, id, userId) {
//     (this.title = title),
//       (this.image = image),
//       (this.description = description),
//       (this.price = price),
//       (this._id = new BSON.ObjectId(id)),
//       (this.userId = userId);
//   }

//   insert() {
//     const db = getDb();
//     return db.collection('products').insertOne(this);
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products').find().toArray();
//   }

//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find({ _id: new BSON.ObjectId(id) })
//       .next();
//   }

//   static updateById(product) {
//     const db = getDb();
//     product._id = new BSON.ObjectId(product._id);
//     return db
//       .collection('products')
//       .updateOne({ _id: product._id }, { $set: product });
//   }

//   static deleteById(productId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .deleteOne({ _id: new BSON.ObjectId(productId) });
//   }
// }

// module.exports = Product;
