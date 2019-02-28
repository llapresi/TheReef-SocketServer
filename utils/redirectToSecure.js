// Middleware function that forces https on heroku
module.exports = (req, res, next) => {
  if(req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
};