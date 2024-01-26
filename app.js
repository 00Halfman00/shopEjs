const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { db } = require('./utils/database');
const User = require('./models/user');

const { adminRoute } = require('./router/admin');
const { shopRoute } = require('./router/shop');
const { status404 } = require('./controllers/404');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

db.then(() => {
  const user = User.where({'email': '00johnrambo00@somesome.com'})
  return user.findOne()
})
  .then((user) => {
    if (!user) {
      user = new User({
        firstName: 'John',
        lastName: 'Rambo',
        email: '00johnrambo00@somesome.com',
        cart: {items:[]}
    });
      user.save();
      return user;
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
