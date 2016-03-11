var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('sup now');
});

// var minderRoutes = require('./routes/minder.js');
// minderRoutes(app);

app.get('/minders', middleware.requireAuthentication, function (req, res) {
	var query = req.query;
	var where = {};

	if ( query.completed && ( query.completed === 'true' || query.completed === 'false' )) {
		where.completed = JSON.parse(query.completed.toLowerCase());
	}

	if ( query.q && query.q.length > 0 ) {
		where.description = { $like: '%' + query.q + '%' };
	}

	db.minder.findAll({ where: where }).then(function onSuccess(minders) {
		res.json(minders);
	}, function onError(error) {
		res.status(500).send(error);
	});
});

app.get('/minders/:id', middleware.requireAuthentication, function(req, res) {
	var minderId = parseInt(req.params.id, 10);

	db.minder.findById(minderId).then(function onSuccess(minderObj) {
		if ( minderObj ) {
			res.json(minderObj.toJSON());
		} else {
			res.status(404).send('Can\'t find entry with that id = ' + minderId);
		}
	}, function onError(error) {
		res.status(500).send();
	});
});

// MINDER CREATE
app.post('/minders', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.minder.create(body).then(function onSuccess(newMinderObj) {
		res.json(newMinderObj.toJSON());
	}, function onError(error) {
		res.status(400).json(error.errors);
	});
});

// UPDATE
app.put('/minders/:id', middleware.requireAuthentication, function(req, res) {
	var minderId = parseInt(req.params.id, 10);
	
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if ( body.hasOwnProperty('completed') ) {
		attributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).json({
			"error": "Not a valid change for 'completed'."
		})
	}

	if ( body.hasOwnProperty('description') ) {
		attributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).json({
			"error": "Not a valid change for 'description'."
		});
	}

	db.minder.findById(minderId).then(function (minderObj) {
		if ( minderObj ) {
			minderObj.update(attributes).then(function onSuccess(minderObj) {
				res.json(minderObj.toJSON());
			}, function onError(error){
				res.status(400).json(error);
			});
		} else {
			res.status(404).send('Couldn\'t find a matching entry');
		}
	}, function onError(error) {
		res.status(500).send(error);
	});
});

// DELETE
app.delete('/minders/:id', middleware.requireAuthentication, function(req, res) {
	var minderId = parseInt(req.params.id, 10);

	db.minder.findById(minderId).then(function onSuccess(minderObj) {
		if ( minderObj ) {
			minderObj.destroy().then(function onDelete() {
				res.send(minderObj);
			}, function onError(error) {
				res.status(500).send(error);
			});
		} else {
			res.status(404).send('Could not find that entry');
		}
	}, function onError(error) {
		res.status(500).send(error);
	});
});

// USERS CREATE
app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function onSuccess(newUser) {
		res.json(newUser.toPublicJSON());
	}, function onError(error) {
		res.status(400).json(error);
	});
});

// USER LOGIN POST
app.post('/users/login', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	if ( !body.email || !body.password ) {
		res.status(500).send('authentication requires email and password');
	}

	db.user.authenticate(body).then(function onSuccess(userObj) {
		var token = userObj.generateToken('authentication');

		if (token) {
			res.header('Auth', token).json(userObj.toPublicJSON());
		} else {
			res.status(401).send('Invalid Credentials');
		}
		
	}, function onError(error) {
		res.status(401).send('Invalid Credentials');
	});
});


db.sequelize.sync({force: true}).then(function () {
	app.listen(port, function () {
		console.log('Express is listening on ' + port);
	});
});




