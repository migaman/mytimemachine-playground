var fs = require('fs');
var express = require('express');
var bodyparser = require('body-parser');
var app = express();

app.use(bodyparser.json());
app.use(function (req, res, next) {
	next();
});
app.use(express.static('./static'));
app.use('/contracts', express.static('./build/contracts'));


app.listen(9001);
