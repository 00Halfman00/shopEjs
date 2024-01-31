const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
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
        { productId: productId, quantity: 1 },
      ],
    };
    this.cart = cart;
  }
  return this.save();
};

userSchema.methods.removeItem = function (productId) {
  this.cart.items = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId;
  });
  return this.save();
};

userSchema.methods.addOrder = function (user) {
  if (!user.cart.items[0]) return 'Empty';
  return user
    .populate('cart.items.productId')
    .then((user) => {
      let total = 0;
      const products = user.cart.items.map((i) => {
        total += +i.productId.price * +i.quantity;
        return {
          _id: i.productId._id,
          title: i.productId.title,
          image: i.productId.image,
          description: i.productId.description,
          price: i.productId.price,
          quantity: i.quantity,
        };
      });
      const order = new Order({
        userId: user._id,
        products: products,
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
