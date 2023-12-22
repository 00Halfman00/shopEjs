const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const {adminRoute} = require('./router/admin');
const {shopRoute} = require('./router/shop');
const {status404} = require('./controllers/404');

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/admin', adminRoute);
app.use('/', shopRoute);
app.use(status404);

app.listen(3000);
