const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { db, getDb } = require('./utils/database');
const User = require('./models/user');

const { adminRoute } = require('./router/admin');
const { shopRoute } = require('./router/shop');
const { status404 } = require('./controllers/404');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

db.then(() => {
  const db = getDb();
  return db
    .collection('users')
    .find({ email: '00johnrambo00@somesome.com' })
    .next();
})
  .then((user) => {
    if (!user) {                 // so the plan is to add carts to the emty array and each cart is an order
      user = new User('John', 'Rambo', '00johnrambo00@somesome.com', {items: [], total: 0}, [] );
      user.insert();            // but with quantity and a total. In that case, might as well have total in cart too
      return user;              // and just get cart and add it untouched
    }
    return user;
  })
  .then((user) => {
    app.use((req, res, next) => {
      req.user = user;
      next();
    });
  })
  .then(() => {
    app.use('/admin', adminRoute);
    app.use('/', shopRoute);
    app.use(status404);
  })
  .then(() => {
    app.listen(3000);
    console.log('listening on port: 3000');
  })
  .catch((err) => console.log(err));
