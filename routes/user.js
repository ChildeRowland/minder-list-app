var colors = require('./../dev/colors.js');
var express = require('express');
var bodyParser = require('body-parser');
var db = require('./../db.js');
var middleware = require('./../middleware.js')(db);
var _ = require('underscore');

var app = express();
app.use(bodyParser.json());

module.exports = function (app) {

	app.post('/users', function (req, res) {
		var body = _.pick(req.body, 'email', 'password');

		db.user.create(body).then(function onSuccess(newUser) {
			res.json(newUser.toPublicJSON());
		}, function onError(error) {
			res.status(400).json(error);
		});
	});

	app.delete('/user', middleware.requireAuthentication, function (req, res) {
		db.user.findOne({ 
			where: {
				id: req.user.id
			}
		}).then(function userFound(user) {
			user.destroy().then(function () {
				req.token.destroy().then(function () {
					res.send('All user data destroyed');
				}, function onError(error) {
					res.send('Problem destorying the token');
				});
			}, function onError() {
				res.send('Problem destorying the user');
			});
		}, function onError() {
			res.send('could not find the user');
		});
	});

	app.route('/users/login')
		.post(function (req, res) {
			var body = _.pick(req.body, 'email', 'password');
			var userInstance;

			if ( !body.email || !body.password ) {
				res.status(500).send('authentication requires email and password');
			}

			db.user.authenticate(body).then(function onSuccess(userObj) {
				var token = userObj.generateToken('authentication');
				userInstance = userObj;

				return db.token.create({
					token: token
				});

				// if (token) {
				// 	res.header('Auth', token).json(userObj.toPublicJSON());
				// } else {
				// 	res.status(401).send('Invalid Credentials');
				// }
				
			}).then(function (tokenInstance) {
				res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
			}).catch(function onError(error) {
				res.status(401).send('Invalid Credentials');
			});
		})
		.delete(middleware.requireAuthentication, function (req, res) {
			req.token.destroy().then(function () {
				res.status(200).send('You\'ve been logged out');
			}).catch(function () {
				res.status(500).send('Something went wrong while logging out');
			});
		});
};

