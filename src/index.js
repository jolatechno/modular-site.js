const imports = require('./views-js/modules/imports')
const app = imports.functions.init();

const main = require('./views-js/main');
const base = require('./views-js/base');

const joined = base.concat(main);
const links = imports.functions.links(joined);

joined.forEach(page => {
  if(page.get)
    app.get(page.link, imports.functions.logginMiddleware(page.logginRequire), page.get(links));
  if(page.post)
    app.post(page.link, imports.functions.logginMiddleware(page.logginRequire), page.post(links));
});

app.get('/', function(req, res) {
  res.render('home', {isLoggedIn:imports.functions.isLoggedIn(req), message:req.query.message, links:links, stripe_public_key:imports.constants.stripe_public_key, email:req.session.email});
});
