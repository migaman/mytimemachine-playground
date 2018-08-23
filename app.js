'use strict';

require('env2')('.env');
var fs = require('fs');
var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');
var routeAPIVideos = require('./api/routes/videoroutes');
var log4js = require('log4js');
var app = express();


/**
 * Initialise log4js first, so we don't miss any log messages
 */
log4js.configure('./config/log4js.json');
var log = log4js.getLogger("default");

/**
 * make a log directory, just in case it isn't there.
 */
try {
  fs.mkdirSync('./logs');
} catch (e) {
  if (e.code != 'EEXIST') {
    log.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}



const EXAMPLE_ADDRESS = process.env.EXAMPLE_CONTRACT_ADDRESS || '0xca4b024f3f7279534ccb5dc4a528c46afa79eed3';
//Needs feature Dyno Metadata (https://stackoverflow.com/questions/7917523/how-do-i-access-the-current-heroku-release-version-programmatically)
const VERSION = process.env.HEROKU_RELEASE_VERSION;


// setup the logger
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'debug' }));
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(function (req, res, next) {
  next();
});
app.use(express.static('./static'));
app.use('/contracts', express.static('./build/contracts'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false
}));


app.use(flash());


routeAPIVideos(app);


app.get('/', function (req, res) {
  req.flash('info', 'This is a flash info message using the express-flash module.');
  req.flash('error', 'This is a flash error message using the express-flash module.');
  req.flash('success', 'This is a flash success message using the express-flash module.');
  res.render('index', { title: 'Example Page', address: EXAMPLE_ADDRESS, releaseversion: VERSION });
});




var port = process.env.PORT || 3000;
app.listen(port, function () {
  log.info('app listening on port neu ' + port);
  log.debug('debug app listening on port neu ' + port);
  log.warn('warn app listening on port neu ' + port);
  log.error('error app listening on port neu ' + port);
});