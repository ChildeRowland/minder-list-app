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

db.sequelize.sync({force: true}).then(function () {
	app.listen(port, function () {
		console.log(colors.info('Express is listening on ' + port));
	});
});




