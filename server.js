var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
	res.send('sup now');
});

app.listen(port, function () {
	console.log('Express is listening on ' + port);
});