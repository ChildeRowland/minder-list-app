var colors = require('./dev/colors.js');
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/client');
app.use('/assets', express.static(__dirname + '/client'));

app.get('/', function (req, res) {
	res.render('index.ejs');
});

var minderRoutes = require('./routes/minder.js');
var userRoutes = require('./routes/user.js');

minderRoutes(app);
userRoutes(app);


// // USERS CREATE
// app.post('/users', function (req, res) {
// 	var body = _.pick(req.body, 'email', 'password');

// 	db.user.create(body).then(function onSuccess(newUser) {
// 		res.json(newUser.toPublicJSON());
// 	}, function onError(error) {
// 		res.status(400).json(error);
// 	});
// });

// // USER LOGIN POST
// app.post('/users/login', function (req, res) {
// 	var body = _.pick(req.body, 'email', 'password');
// 	var userInstance;

// 	if ( !body.email || !body.password ) {
// 		res.status(500).send('authentication requires email and password');
// 	}

// 	db.user.authenticate(body).then(function onSuccess(userObj) {
// 		var token = userObj.generateToken('authentication');
// 		userInstance = userObj;

// 		return db.token.create({
// 			token: token
// 		});

// 		// if (token) {
// 		// 	res.header('Auth', token).json(userObj.toPublicJSON());
// 		// } else {
// 		// 	res.status(401).send('Invalid Credentials');
// 		// }
		
// 	}).then(function (tokenInstance) {
// 		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
// 	}).catch(function onError(error) {
// 		res.status(401).send('Invalid Credentials');
// 	});
// });

// // DELETE /user/logout
// app.delete('api/users/login', middleware.requireAuthentication, function (req, res) {
// 	req.token.destroy().then(function () {
// 		res.status(204).send('You\'ve been logged out');
// 	}).catch(function () {
// 		res.status(500).send('Something went wrong while logging out');
// 	});
// });


db.sequelize.sync({force: true}).then(function () {
	app.listen(port, function () {
		console.log(colors.info('Express is listening on ' + port));
	});
});




