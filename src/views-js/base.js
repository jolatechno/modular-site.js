const library = require('./modules/library');
const functions = require('./modules/functions');

const va = library.validator;
const db = library.db;
const hash = functions.hash;
const log_err = functions.log_err;

module.exports = [
  {
    position:"upper",
    link: "/login/",
    label: "Login",
    logginRequire: false,
    get: links => function (req, res) {
      res.render('base/login', {isLoggedIn:false, message:req.query.message, links:links});
    },
    post: links => function (req, res) {
      const password = req.body.password;
      const username = req.body.username;

      if(!va.isAlphanumeric(username))
        return res.redirect('/login/?message=' + encodeURIComponent("username isn't valid"));

      if(!(va.isAlphanumeric(password) && va.isLength(password, {min:6, max: undefined}) && !va.isNumeric(password) && !va.isAlpha(password) && !va.isLowercase(password) && !va.isUppercase(password)))
        return res.redirect('/login/?message=' + encodeURIComponent("password isn't valid"));

      db.all('SELECT password, email FROM user WHERE user_id = ?;', [username], (err, rows) => {
        if(err) {
          log_err(err);
          return res.redirect('/login/?message=' + encodeURIComponent("encountered an error "));
        }
        if(rows[0]) {
          if(rows[0].password == hash(password)) {
            req.session.email = rows[0].email;
            req.session.user_id = username;
            return res.redirect('/?message=' + encodeURIComponent("welcome back " + username));
          }
          return res.redirect('/login/?message=' + encodeURIComponent("Wrong password"));
        }
        return res.redirect('/login/?message=' + encodeURIComponent("username dosen't exist"));
      });
    }
  },
  {
    position:"upper",
    link: "/register/",
    label: "Register",
    logginRequire: false,
    get: links => function (req, res) {
      res.render('base/register', {isLoggedIn:false, message:req.query.message, links:links});
    },
    post: links => function (req, res) {
      const password = req.body.password;
      const confirmation = req.body.confirmation;
      const email = req.body.email;
      const username = req.body.username;

      if(password != confirmation)
        return res.redirect('/register/?message=' + encodeURIComponent("passwords don't match"));

      if(!(va.isAlphanumeric(password) && va.isLength(password, {min:6, max: undefined}) && !va.isNumeric(password) && !va.isAlpha(password) && !va.isLowercase(password) && !va.isUppercase(password)))
        return res.redirect('/register/?message=' + encodeURIComponent("password isn't valid"));

      if(!va.isAlphanumeric(username))
        return res.redirect('/register/?message=' + encodeURIComponent("username isn't valid"));

      if(!va.isEmail(email))
        return res.redirect('/register/?message=' + encodeURIComponent("email isn't valid"));

      db.all('SELECT password, email FROM user WHERE user_id = ?;', [username], (err, rows) => {
        if(err) {
          log_err(err);
          return res.redirect('/register/?message=' + encodeURIComponent("encountered an error"));
        }
        if(rows[0])
          return res.redirect('/register/?message=' + encodeURIComponent("username or email already taken"));
        db.run('INSERT INTO user (user_id, email, password) VALUES (?, ?, ?)', [username, email, hash(password)])
        req.session.email = email;
        req.session.user_id = username;
        return res.redirect('/?message=' + encodeURIComponent("welcome " + username));
      });
    }
  },
  {
    position:"upper",
    link: "/logout/",
    label: "Logout",
    logginRequire: true,
    get: links => function (req, res) {
      req.session.destroy(err => {if(err) log_err(err)});
      return res.redirect('/?message=' + encodeURIComponent("logedout succesfull"));
    }
  },
  {
    link: "/unregister/",
    logginRequire: true,
    get: links => function (req, res) {
      db.run('DELETE FROM user WHERE user_id = ?', [req.session.user_id]);
      req.session.destroy(err => {if(err) log_err(err)});
      return res.redirect('/?message=' + encodeURIComponent("unregistered succesfull"));
    }
  },
  {
    position:"upper",
    link: "/profile/",
    label: "Profile",
    logginRequire: true,
    get: links => function (req, res) {
      return res.render('base/profile', {isLoggedIn:true, message:req.query.message, links:links, email:req.session.email, username:req.session.user_id});
    }
  },
  {
    link: "/modifyUsername/",
    logginRequire: true,
    post: links => function (req, res) {
      if(!va.isAlphanumeric(username))
        return res.redirect('/profile/?message=' + encodeURIComponent("username isn't valid"));

      return res.redirect('/profile/?message=' + encodeURIComponent("username succesfuly modifyed"));
    }
  },
  {
    link: "/modifyEmail/",
    logginRequire: true,
    post: links => function (req, res) {
      if(!va.isEmail(email))
        return res.redirect('/profile/?message=' + encodeURIComponent("email isn't valid"));

      return res.redirect('/profile/?message=' + encodeURIComponent("email succesfuly modifyed"));
    }
  },
  {
    link: "/modifyPassword/",
    logginRequire: true,
    post: links => function (req, res) {
      if(password != confirmation)
        return res.redirect('/profile/?message=' + encodeURIComponent("passwords don't match"));

      if(!(va.isAlphanumeric(password) && va.isLength(password, {min:6, max: undefined}) && !va.isNumeric(password) && !va.isAlpha(password) && !va.isLowercase(password) && !va.isUppercase(password)))
        return res.redirect('/register/?message=' + encodeURIComponent("password isn't valid"));

      return res.redirect('/profile/?message=' + encodeURIComponent("password succesfuly modifyed"));
    }
  },
]
