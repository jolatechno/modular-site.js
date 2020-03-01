constants = require('./constants');

const sqlite3 = require('sqlite3').verbose();

module.exports = {
  url: require('url'),
  db: new sqlite3.Database(constants.database),
  nodemailer: require('nodemailer').createTransport(constants.email),
  fs: require('fs-extra'),
  validator: require("validator"),
}
