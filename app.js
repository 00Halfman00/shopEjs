const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const User = require('./models/user');
const { db } = require('./utils/database');

const { adminRoute } = require('./router/admin');
const { shopRoute } = require('./router/shop');
const { status404 } = require('./controllers/404');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// app.use('/admin', adminRoute);
// app.use('/', shopRoute);
// app.use(status404);

db.then(() => {
  app.use((req, res, next) => {
    User.findByPk(1)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  });
})
  .then(() => {
    app.use('/admin', adminRoute);
    app.use('/', shopRoute);
    app.use(status404);
  })
  .then(() => app.listen(3000))
  .catch(err => console.log(err))

module.exports = app;
