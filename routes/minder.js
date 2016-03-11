var express = require('express');
var bodyParser = require('body-parser');
var db = require('./../db.js');

var app = express();
app.use(bodyParser.json());

module.exports = function (app) {
	// READ all entries with optional params
	app.get('/minders', function (req, res) {
		var query = req.query;
		var where = {};

		if ( isValidBoolean(query, 'completed') ) {
			where.completed = JSON.parse(query.completed.toLowerCase());
		}

		if ( query.hasOwnProperty('q') && query.q.length > 0 ) {
			where.description = { $like: '%' + query.q + '%' };
		}

		db.minder.findAll({ where: where }).then(function onSuccess(allMinders) {
			res.json(allMinders);
		}, function onError(error) {
			res.status(500).send(error);
		});
	});
	// // READ one enty with id
	// app.get('/minders/:id', function (req, res) {

	// });
	// // CREATE a new entry
	// app.post('/minders', function (req, res) {

	// });
	// // UPDATE entry with id
	// app.put('/minder/:id', function (req, res) {

	// });
	// // DESTROY entry with id
	// app.delete('/minder/:id', function (req, res) {

	// });
}

// HELPER FUNCTIONS
function isValidBoolean (obj, prop) {
	if ( obj.hasOwnProperty(prop) && 
		 ( obj[prop] === 'true' || obj[prop] === 'false' )) {
		console.log('inside the helper');
		return true;
	} 
}

// var minderRoutes = require('./routes/minder.js');
// minderRoutes(app);

