require('env2')('.env');
var fs = require('fs');
var express = require('express');
var bodyparser = require('body-parser');
var app = express();

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

app.get('/', function (req, res) {
  res.render('index', { title: 'Example Page', address: EXAMPLE_ADDRESS, releaseversion: VERSION });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('app listening on port ' + port);
});