const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const flash = require('connect-flash');
const { db } = require('./utils/database');
const https = require('https');
const fs = require('fs');
const multer = require('multer');
const {fileStorage, fileFilter} = require('./utils/fileStore')

const { adminRoute } = require('./router/admin');
const { shopRoute } = require('./router/shop');
const { authRoute } = require('./router/auth');
const { status404, status500 } = require('./controllers/errors');
const csrf = csurf();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(express.static('public'));
app.use('/images', express.static('images'));

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
    app.use(flash());
    app.use((req, res, next) => {
      res.locals.csrfToken = req.csrfToken();
      res.locals.isAuthenticated = req.session.isAuthenticated;
      next();
    });
  })
  .then(() => {
    app.use('/admin', adminRoute);
    app.use(shopRoute);
    app.use(authRoute);
    app.use('/err/500', status500);
    app.use(status404);
    app.use((err, req, res, next) => {
      res.redirect('/err/500');
    });
  })
  .then(() => {
    return {
      key: fs.readFileSync('../../Desktop/cert/server.key'),
      cert: fs.readFileSync('../../Desktop/cert/server.crt'),
    };
  })
  // .then(app.listen(3000))
  .then((cert) => {
    https
      .createServer(cert, app)
      .listen(443, () => console.log('server is running on port: 443'));
  })
  .catch((err) => {
    const error = new Error(err);
        error.httpStatus = 500;
        return next(error);
  });
