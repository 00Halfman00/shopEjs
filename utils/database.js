const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const db = new Promise((res, rej) => {
  if (true) {
    res(
      mongoose
        .connect(
          `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.8apa99d.mongodb.net/shop_products?retryWrites=true&w=majority`
        )
        .catch((err) =>
          console.log('THERE WAS AN ERROR CONNECTING MONGODB: ', err)
        )
    );
  } else {
    rej('the database is false');
  }
});

module.exports = { db };
