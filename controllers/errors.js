exports.status404 = (req, res, next) => {
  res
    .status(404)
    .render('err/404', {
      pageTitle: 'Page Not Found',
      isAuthenticated: req.session.isAuthenticated,
    });
};

exports.status500 = (req, res, next) => {
  res
    .status(500)
    .render('err/500', {
      pageTitle: 'Server is down. Try again later.',
      isAuthenticated: req.session.isAuthenticated,
    });
};


