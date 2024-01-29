const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  cart: {
  ordered: [
    {
      productId: [
        {
          _id: { type: Schema.Types.ObjectId, required: true },
          title: { type: String, required: true },
          image: { type: String, required: true },
          description: { type: String, required: true },
          price: { type: Number, required: true },
          userId: { type: Schema.Types.ObjectId, required: true },
        },
      ],
      quantity: Number,
    },
  ],
},

  total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);


// cart: {
//   ordered: [
//     {
//       product: [
//         {
//           _id: { type: Schema.Types.ObjectId, required: true },
//           title: { type: String, required: true },
//           image: { type: String, required: true },
//           description: { type: String, required: true },
//           price: { type: Number, required: true },
//           userId: { type: Schema.Types.ObjectId, required: true },
//         },
//       ],
//       quantity: Number,
//     },
//   ],
// },
