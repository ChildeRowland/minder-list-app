module.exports = function (db) {

	return {
		requireAuthentication: function (req, res, next) {
			var token = req.get('Auth');

			db.user.findByToken(token).then(function onSuccess(user) {
				req.user = user;
				next();
			}, function onError (error) {
				res.status(401).send(error);
			});
		}
	};

};