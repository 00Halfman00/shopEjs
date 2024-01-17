const mongodb = require('mongodb');
const { MongoClient } = mongodb;
const dotenv = require('dotenv');
dotenv.config();
let _db;

const db = new Promise((res, rej) => {
  if (true) {
    res(
      MongoClient.connect(
        `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.8apa99d.mongodb.net/shop_products?retryWrites=true&w=majority`
      )
        .then((client) => {
          _db = client.db();
          //return client; the client will not be returned to app but access to the database will be passed instead to other folders/modules
          console.log('MONGODB IS UP AND RUNNING');
        })
        .catch((err) =>
          console.log('THERE WAS AN ERROR CONNECTING MONGODB: ', err)
        )
    );
  } else {
    rej('the database is false');
  }
});

const getDb = () => {
  if (_db) return _db;
  throw Error;
};

module.exports = { db, getDb };
