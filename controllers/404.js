const status404 = (req, res, next) => {
  res.status(404).render('err/404', {'pageTitle': 'Page Not Found'});
}

exports.status404 = status404;
