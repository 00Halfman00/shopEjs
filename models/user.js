const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const Order = require('./orders');
const { BSON } = require('mongodb');

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
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId) {
  let flag = 0,
    cart = '';
  for (const p of this.cart.items) {
    if (p.productId.toString() === productId) {
      ++flag;
      p.quantity += 1;
    }
  }
  if (!flag) {
    cart = {
      items: [
        ...this.cart.items,
        { productId: new BSON.ObjectId(productId), quantity: 1 },
      ],
    };
    this.cart = cart;
  }
  console.log('this.cart.items at end: ', this.cart.items);
  return this.save();
};

userSchema.methods.removeItem = function (productId) {
  this.cart.items = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId;
  });
  return this.save();
};

userSchema.methods.addOrder = function (user) {
  if(!user.cart.items[0]) return 'Empty';
  return user
    .populate('cart.items.productId')
    .then((user) => {
      console.log('user.cart.items in order: ', user.cart.items)
      let total = 0;
      user.cart.items.forEach(
        (i) => (total += +i.productId.price * +i.quantity)
      );
      const order = new Order({
        userId: this._id,
        cart: { ordered: user.cart.items },
        total: total,
        date: new Date(),
      });
      return order;
    })
    .then((order) => {
      order.save();
      this.cart = { items: [] };
      return this.save();
    })
    .catch((err) => console.log(err));
};

module.exports = mongoose.model('User', userSchema);
