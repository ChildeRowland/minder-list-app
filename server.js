var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var port = process.env.PORT || 3000;
var dbCollection = require('./data.js');
var idCounter = 2;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('sup now');
});

app.get('/minders', function (req, res) {
	res.json(dbCollection);
});

app.get('/minders/:id', function (req, res) {
	var minderId = parseInt(req.params.id, 10);
	var matchingObj = _.findWhere(dbCollection, {id: minderId});

	if ( matchingObj ) {
		res.json(matchingObj);
	} else {
		res.status(404).json({"error": "There is no matching entry"});
	}
});

app.post('/minders', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if ( !_.isString(body.description) || body.description.trim().length === 0 || !_.isBoolean(body.completed) ) {
		return res.status(400).send();
	}

	body.description = body.description.trim();

	body.id = idCounter++;
	dbCollection.push(body);
	res.json(body);
});

app.put('/minders/:id', function (req, res) {
	var minderId = parseInt(req.params.id, 10);
	var matchingObj = _.findWhere(dbCollection, {id: minderId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if ( !matchingObj ) {
		return res.status(404).json({"error": "Entry not found"});
	}

	if ( body.hasOwnProperty('completed') && _.isBoolean(body.completed) ) {
		validAttributes.completed = body.completed;
	} else if ( body.hasOwnProperty('completed') ) {
		return res.status(400).json({"error": "Not a valid change for 'completed'."})
	} 

	if ( body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0 ) {
		validAttributes.description = body.description;
	} else if ( body.hasOwnProperty('description') ) {
		return res.status(400).json({"error": "Not a valid change for 'description'."});
	}

	_.extend(matchingObj, validAttributes);
	res.json(matchingObj);
});

app.delete('/minders/:id', function (req, res) {
	var minderId = parseInt(req.params.id, 10);
	var matchingObj = _.findWhere(dbCollection, {id: minderId});

	if ( matchingObj ) {
		dbCollection = _.without(dbCollection, matchingObj);
		res.json(matchingObj);
	} else {
		res.status(404).json({"error": "There is no matching entry"});
	}
});

app.listen(port, function () {
	console.log('Express is listening on ' + port);
});





