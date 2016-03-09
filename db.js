var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	dialect: 'sqlite',
	storage: __dirname + '/data/dev-minder-api.sqlite'
});

var db = {};

db.minder = sequelize.import(__dirname + '/models/minder.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;