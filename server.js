var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;
var dbCollection = require('./data.js');
var idCounter = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('sup now');
});

app.post('/minders', function (req, res) {
	var body = req.body;
	body.id = idCounter++;
	dbCollection.push(body);
	res.json(body);
});

app.get('/minders', function (req, res) {
	res.json(dbCollection);
});

app.get('/minders/:id', function (req, res) {
	var id = parseInt(req.params.id, 10);
	var matchingObj;

	for ( item in dbCollection ) {
		if ( dbCollection[item].id === id ) {
			matchingObj = dbCollection[item];
		}
	}

	if ( matchingObj ) {
		res.json(matchingObj);
	} else {
		res.status(404).send();
	}
});

app.listen(port, function () {
	console.log('Express is listening on ' + port);
});