constants = require('./constants.json');
library = require('./library.js');

module.exports = {
  links: function(links, isLoggedIn) {
    return {
      upper: links.filter(page => page.position == "upper").map(page => [page.link, page.label, page.logginRequire]),
      lower: links.filter(page => page.position == "lower").map(page => [page.link, page.label, page.logginRequire])
    }
  },
  hash: function(password) {
    return require('crypto').createHmac('sha256', password).update('phrase').digest('hex');
  },
  log_err: function(err) {
    console.log(err);
    var err = JSON.stringify(err);
    library.db.run("INSERT INTO errors (err) VALUES (?)", [err.replace(/'/g, '"')]);
  },
  init: function() {
    const express = require('express');
    const app = express();

    constants.initial_command.forEach(command => library.db.run(command));

    app.use(express.static('public'))
    app.use(require('express-session')(constants.app_session));
    app.use(require('body-parser').urlencoded({ extended: true }));

    app.set('view engine', 'ejs');

    app.listen(constants.port, () => console.log('listening on port ', constants.port));

    return app;
  },
  logginMiddleware: function(logginRequire) {
    if(typeof logginRequire == 'undefined')
      return (req, res, next) => next();
    if(logginRequire)
      return function(req, res, next) {
        if(req.session.email && req.session.user_id)
          return next();
        return res.redirect('/login/?message=' + encodeURIComponent("login required"));
      }
    return function(req, res, next) {
      if(req.session.email && req.session.user_id){
        if(req.headers.referer)
          return res.redirect(library.url.parse(req.headers.referer).pathname + '?message=' + encodeURIComponent("logout required"));
        return res.redirect('/?message=' + encodeURIComponent("logout required"));
      }
      return next();
    }
  },
  isLoggedIn: function(req) {
    if(req.session.email && req.session.user_id)
      return true;
    return false;
  },
}
