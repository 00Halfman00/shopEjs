const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const flash = require('connect-flash');
const { db } = require('./utils/database');
const https = require('https');
const fs = require('fs');

const { adminRoute } = require('./router/admin');
const { shopRoute } = require('./router/shop');
const { authRoute } = require('./router/auth');
const { status404 } = require('./controllers/404');
const csrf = csurf();

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
    app.use(csrf);
    app.use(flash()); // if problems are rendered instead of redirecting, then this flash is unnecessary
    app.use((req, res, next) => {
      res.locals.csrfToken = req.csrfToken();
      res.locals.isAuthenticated = req.session.isAuthenticated;
      next();
    })
  })
  .then(() => {
    app.use('/admin', adminRoute);
    app.use(shopRoute);
    app.use(authRoute);
    app.use(status404);
  })
  .then(()=> {
    return {
      key: fs.readFileSync('../../Desktop/cert/server.key'),
      cert: fs.readFileSync('../../Desktop/cert/server.crt')
    }
  })
  // .then(app.listen(3000))
  .then((cert) => {
    https.createServer(cert, app).listen(443, () => console.log('server is running on port: 443'));
  })
  .catch((err) => console.log(err));
