const { BSON } = require('mongodb');
const { getDb } = require('../utils/database');

class User {
  constructor(firstName, lastName, email, cart, _id) {
    (this.firstName = firstName),
      (this.lastName = lastName),
      (this.email = email),
      (this.cart = cart),
      (this._id = _id);
  }

  insert() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  add2Cart(product) {
    let flag = 0,
      cart = '';
    for (const p of this.cart.items) {
      if (p._id.toString() === product._id.toString()) {
        ++flag;
        p.quantity += 1;
      }
    }
    if (!flag) {
      cart = {
        items: [
          ...this.cart.items,
          { _id: new BSON.ObjectId(product._id), quantity: 1 },
        ],
      };
      this.cart = cart;
    } else cart = this.cart;
    const db = getDb();
    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { 'cart.items': cart.items } });
  }

  getCart() {
    const db = getDb();
    return db
      .collection('products')
      .find({
        _id: {
          $in: this.cart.items.map((item) => new BSON.ObjectId(item._id)),
        },
      })
      .toArray()
      .then((products) => {
        return products.map((item) => {
          let qty;
          for (let i of this.cart.items) {
            if (i._id.toString() === item._id.toString()) {
              qty = i.quantity;
            }
          }
          return {
            product: item,
            quantity: qty,
          };
        });
      });
  }

  removeItem(productId) {
    this.cart.items = this.cart.items.filter(
      (item) => item._id.toString() !== productId
    );
    const db = getDb();
    // return db.collection('users').updateOne({ _id: this._id }, { $set: this }); // different way of getting the same result
    return db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $pull: { 'cart.items': { _id: new BSON.ObjectId(productId) } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart().then((cart) => {
      return db
        .collection('orders')
        .insertOne({ userId: this._id, items: cart, date: new Date() })
        .then(() => {
          this.cart = { items: [], total: 0 };
          return db
            .collection('users')
            .updateOne({ _id: this._id }, { $set: this });
        });
    });
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders').find({ userId: this._id }).toArray();
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection('users')
      .find({ _id: new BSON.ObjectId(id) })
      .next();
  }
}

module.exports = User;

