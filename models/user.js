const { BSON } = require('mongodb');
const { getDb } = require('../utils/database');

class User {
  constructor(firstName, lastName, email, cart, order, _id) {
    (this.firstName = firstName),
      (this.lastName = lastName),
      (this.email = email),
      (this.cart = cart), // {items: [ {_id, qty: 1}, {_id, qty: 2} ]}
      (this.order = order),
      (this._id = _id);
  }

  insert() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  add2Cart(product) {
    // so what is the problem? this.cart is not the one from the database ? it is
    let flag = 0,
      cart = '';
    for (const p of this.cart.items) {
      if (p._id.toString() === product._id.toString()) {
        // if product is in cart
        ++flag;
        p.quantity += 1;
        this.cart.total += +p.price;
      }
    }
    if (!flag) {
      // if product is not in cart
      cart = {
        items: [...this.cart.items, { ...product, quantity: 1 }],
        total: this.cart.total
          ? (this.cart.total += +product.price)
          : +product.price,
      };
      this.cart = cart;
    } else cart = this.cart;
    console.log('total: ', this.cart.total);
    /////////////////////////////////////// update to mongodb
    const db = getDb();
    db.collection('users').updateOne(
      { _id: this._id },
      { $set: { cart: cart } }
    );
  }

  addOrder() {
    this.order[this.order.length] = {
      items: [...this.cart.items],
      total: this.cart.total,
    };
    this.cart = {items: [], total: 0}
    const db = getDb();
    console.log(this)
    db.collection('users').updateOne({_id: this._id}, {$set: this});
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
