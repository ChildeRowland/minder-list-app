var colors = require('./../dev/colors.js');
var express = require('express');
var bodyParser = require('body-parser');
var db = require('./../db.js');
var middleware = require('./../middleware.js')(db);
var _ = require('underscore');

var app = express();
app.use(bodyParser.json());

module.exports = function (app) {

	app.route('/minders/')
		.get(middleware.requireAuthentication, function (req, res) {
			var query = req.query;
			var where = {
				userId: req.user.get('id')
			};

			if ( isValidBoolean(query, 'completed') ) {
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
		})
		.post(middleware.requireAuthentication, function (req, res) {
			var body = _.pick(req.body, 'description', 'completed');

			db.minder.create(body).then(function onCreate(minder) {
				req.user.addMinder(minder).then(function () {
					return minder.reload();
				}).then(function (minder) {
					res.json(minder.toJSON());
				});
			}, function onError(error) {
				res.status(400).json(error.errors);
			});
		});

	app.route('/minders/:id')
		.get(middleware.requireAuthentication, function (req, res) {
			var minderId = parseInt(req.params.id, 10);

			db.minder.findOne({
				where: {
					id: minderId,
					userId: req.user.get('id')
				}
			}).then(function onSuccess(minder) {
				if ( minder ) {
					res.json( minder.toJSON() );
				} else {
					res.status(404).send('Can\'t find entry with that id = ' + minderId);
				}
			}, function onError(error) {
				res.status(500).send();
			});
		})
		.put(middleware.requireAuthentication, function (req, res) {
			var minderId = parseInt(req.params.id, 10);
			
			var body = _.pick(req.body, 'description', 'completed');
			var attributes = {};

			if ( isValidBoolean(body, 'completed') ) {
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

			db.minder.findOne({
				where: {
					id: minderId,
					userId: req.user.get('id')
				}
			}).then(function (minder) {
				if ( minder ) {
					minder.update(attributes).then(function onSuccess(minder) {
						res.json( minder.toJSON() );
					}, function onError(error){
						res.status(400).send('can\'t update');
					});
				} else {
					res.status(404).send('Couldn\'t find a matching entry');
				}
			}, function onError(error) {
				res.status(500).send(error);
			});
		})
		.delete(middleware.requireAuthentication, function (req, res) {
			var minderId = parseInt(req.params.id, 10);

			db.minder.findOne({
				where: {
					id: minderId,
					userId: req.user.get('id')
				}
			}).then(function onSuccess(minder) {
				if ( minder ) {
					minder.destroy().then(function onDelete() {
						res.send( minder );
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
	
};

// HELPER FUNCTIONS
function isValidBoolean (obj, prop) {
	if ( obj.hasOwnProperty(prop) && 
		 ( obj[prop] === 'true' || obj[prop] === 'false' )) {
		console.log('inside the helper');
		return true;
	} 
}





