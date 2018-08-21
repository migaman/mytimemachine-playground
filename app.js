require('env2')('.env');
var fs = require('fs');
var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');
var app = express();

var routeAPIVideos = require('./api/routes/videoroutes');

const EXAMPLE_ADDRESS = process.env.EXAMPLE_CONTRACT_ADDRESS || '0xca4b024f3f7279534ccb5dc4a528c46afa79eed3';
//Needs feature Dyno Metadata (https://stackoverflow.com/questions/7917523/how-do-i-access-the-current-heroku-release-version-programmatically)
const VERSION = process.env.HEROKU_RELEASE_VERSION;

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
  console.log('app listening on port ' + port);
});