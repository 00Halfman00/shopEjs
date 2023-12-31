const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const { products, product1, product2 } = require('./utils/tables');

dotenv.config();
const db = require('./utils/database');
const { adminRoute } = require('./router/admin');
const { shopRoute } = require('./router/shop');
const { status404 } = require('./controllers/404');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/admin', adminRoute);
app.use('/', shopRoute);
app.use(status404);

db.execute('DROP TABLE IF EXISTS Products') // some dummy data
  .then(resolve => db.execute(products))
  .then((resolve) => db.execute(product1))
  .then((resolve) => db.execute(product2))
  .catch((err) => console.log(err));

app.listen(3000);
