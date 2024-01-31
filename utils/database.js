const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');

dotenv.config();

const db = new Promise((res, rej) => {
  if (true) {
    res(
      mongoose
        .connect(
          process.env.URI
        )
        .then(() => {
          return new MongoDBStore({
            uri: process.env.URI,
            databaseName: process.env.DATABASE,
            collection: 'sessions'
          })
        })
        .catch((err) =>
          console.log('THERE WAS AN ERROR CONNECTING MONGODB: ', err)
        )
    );
  } else {
    rej('the database is false');
  }
});

module.exports = { db };
