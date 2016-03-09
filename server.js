var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var port = process.env.PORT || 3000;
var db = require('./db.js');
// var idCounter = 2;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('sup now');
});

app.get('/minders', function(req, res) {
	var queryParams = req.query;
	var filteredMinders = db;

	if (queryParams.completed === 'false') {
		filteredMinders = _.where(filteredMinders, {
			completed: false
		});
	} else if (queryParams.completed === 'true') {
		filteredMinders = _.where(filteredMinders, {
			completed: true
		});
	}

	if (queryParams.q && queryParams.q.length > 0) {
		filteredMinders = _.filter(filteredMinders, function(minder) {
			return minder.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredMinders);
});

app.get('/minders/:id', function(req, res) {
	var minderId = parseInt(req.params.id, 10);

	db.minder.findById(minderId).then(function onSuccess(minderObj) {
		if ( minderObj ) {
			res.json(minderObj.toJSON());
		} else {
			res.status(404).send('Can\'t find entry with that id = ' + minderId);
		}
		// console.log(minderObj)
	}, function onError(error) {
		res.status(500).send();
	});
});

app.post('/minders', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.minder.create(body).then(function onSuccess(newMinderObj) {
		res.json(newMinderObj.toJSON());
	}, function onError(error) {
		console.log(error.errors);
		res.status(400).json(error.errors);
	});
});

app.put('/minders/:id', function(req, res) {
	var minderId = parseInt(req.params.id, 10);
	var matchingObj = _.findWhere(db, {
		id: minderId
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchingObj) {
		return res.status(404).json({
			"error": "Entry not found"
		});
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).json({
			"error": "Not a valid change for 'completed'."
		})
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).json({
			"error": "Not a valid change for 'description'."
		});
	}

	_.extend(matchingObj, validAttributes);
	res.json(matchingObj);
});

app.delete('/minders/:id', function(req, res) {
	var minderId = parseInt(req.params.id, 10);
	var matchingObj = _.findWhere(db, {
		id: minderId
	});

	if (matchingObj) {
		db = _.without(db, matchingObj);
		res.json(matchingObj);
	} else {
		res.status(404).json({
			"error": "There is no matching entry"
		});
	}
});

db.sequelize.sync().then(function () {
	app.listen(port, function () {
		console.log('Express is listening on ' + port);
	});
});




