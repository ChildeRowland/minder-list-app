module.exports = function (db) {

	return {
		requireAuthentication: function (req, res, next) {
			var token = req.get('Auth');

			db.user.findByToken(token).then(function onSuccess(userObj) {
				req.user = userObj;
				next();
			}, function onError (error) {
				res.status(401).send(error);
			});
		}
	};

};