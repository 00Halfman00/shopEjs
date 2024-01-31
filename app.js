const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const { db } = require('./utils/database');

const { adminRoute } = require('./router/admin');
const { shopRoute } = require('./router/shop');
const { authRoute } = require('./router/auth');
const { status404 } = require('./controllers/404');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

db.then((store) => {
  app.use(
    session({
      secret: process.env.THING,
      resave: false,
      saveUninitialized: true,
      store: store,
    })
  );
})
  .then(() => {
    app.use('/admin', adminRoute);
    app.use(shopRoute);
    app.use(authRoute);
    app.use(status404);
  })
  .then(() => {
    app.listen(3000);
    console.log('listening on port: 3000');
  })
  .catch((err) => console.log(err));
