const status404 = (req, res, next) => {
  res
    .status(404)
    .render('err/404', {
      pageTitle: 'Page Not Found',
      isAuthenticated: req.session.isAuthenticated,
    });
};

exports.status404 = status404;
