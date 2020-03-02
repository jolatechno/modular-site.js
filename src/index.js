const functions = require('./views-js/modules/functions');
const app = functions.init();

const main = require('./views-js/main');
const base = require('./views-js/base');

const joined = base.concat(main);
const links = functions.links(joined);

joined.forEach(page => {
  if(page.get)
    app.get(page.link, functions.logginMiddleware(page.logginRequire), page.get(links));
  if(page.post)
    app.post(page.link, functions.logginMiddleware(page.logginRequire), page.post(links));
});

app.get('/', function(req, res) {
  res.render('home', {isLoggedIn:functions.isLoggedIn(req), message:req.query.message, links:links, email:req.session.email});
});
