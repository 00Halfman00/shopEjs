const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const Products = require('./product');
const Order = require('./orders');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId) {
  let flag = 0,
    cart = '';
  for (const p of this.cart.items) {
    if (p.productId.toString() === productId.toString()) {
      ++flag;
      p.quantity += 1;
    }
  }
  if (!flag) {
    cart = {
      items: [...this.cart.items, { productId: productId, quantity: 1 }],
    };
    this.cart = cart;
  } else cart = this.cart;

  this.save();
  return cart;
};

userSchema.methods.getCart = function () {
  return Products.find()
    .where('_id')
    .in(this.cart.items.map((item) => item.productId))
    .then((products) => {
      return products.map((item) => {
        let qty = 0;
        for (let i of this.cart.items) {
          if (i.productId.toString() === item._id.toString()) {
            qty = i.quantity;
          }
        }
        return {
          product: item,
          quantity: qty,
        };
      });
    });
};

userSchema.methods.removeItem = function(productId) {
  this.cart.items = this.cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  this.save();
}

userSchema.methods.addOrder = function () {
  return this.getCart()
    .then((cart) => {
      let total = 0;
      cart.forEach((i) => (total += +i.product.price * +i.quantity));
      const orderCart = cart.map((c) => {
        return {
          product:
            {
              _id: c.product._id,
              title: c.product.title,
              image: c.product.image,
              description: c.product.description,
              price: c.product.price,
              userId: c.product.userId,
            },
          quantity: c.quantity,
        };
      });
      const order = new Order({
        userId: this._id,
        cart: {ordered: orderCart}, //problem is that it only takes one order not many instances at once
        total: total,
        date: new Date(),
      });
      return order;
    })
    .then((order) => {
      order.save();
      this.cart = { items: [] };
    });
};

module.exports = mongoose.model('User', userSchema);

// const { BSON } = require('mongodb');
// const { getDb } = require('../utils/database');

// class User {
//   constructor(firstName, lastName, email, cart, _id) {
//     (this.firstName = firstName),
//       (this.lastName = lastName),
//       (this.email = email),
//       (this.cart = cart),
//       (this._id = _id);
//   }

//   insert() {
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//   }

//   add2Cart(product) {
//     let flag = 0,
//       cart = '';
//     for (const p of this.cart.items) {
//       if (p._id.toString() === product._id.toString()) {
//         ++flag;
//         p.quantity += 1;
//       }
//     }
//     if (!flag) {
//       cart = {
//         items: [
//           ...this.cart.items,
//           { _id: new BSON.ObjectId(product._id), quantity: 1 },
//         ],
//       };
//       this.cart = cart;
//     } else cart = this.cart;
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne({ _id: this._id }, { $set: { 'cart.items': cart.items } });
//   }

// getCart() {
//   const db = getDb();
//   return db
//     .collection('products')
//     .find({
//       _id: {
//         $in: this.cart.items.map((item) => new BSON.ObjectId(item._id)),
//       },
//     })
//     .toArray()
//     .then((products) => {
//       return products.map((item) => {
//         let qty;
//         for (let i of this.cart.items) {
//           if (i._id.toString() === item._id.toString()) {
//             qty = i.quantity;
//           }
//         }
//         return {
//           product: item,
//           quantity: qty,
//         };
//       });
//     });
// }

//   removeItem(productId) {
//     this.cart.items = this.cart.items.filter(
//       (item) => item._id.toString() !== productId
//     );
//     const db = getDb();
//     // return db.collection('users').updateOne({ _id: this._id }, { $set: this }); // different way of getting the same result
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: this._id },
//         { $pull: { 'cart.items': { _id: new BSON.ObjectId(productId) } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart().then((cart) => {
//       return db
//         .collection('orders')
//         .insertOne({ userId: this._id, items: cart, date: new Date() })
//         .then(() => {
//           this.cart = { items: [], total: 0 };
//           return db
//             .collection('users')
//             .updateOne({ _id: this._id }, { $set: this });
//         });
//     });
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection('orders').find({ userId: this._id }).toArray();
//   }

//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .find({ _id: new BSON.ObjectId(id) })
//       .next();
//   }
// }

// module.exports = User;
