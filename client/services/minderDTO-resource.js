angular.module('minderApp')

.factory('minderResource', function($resource, $http) {
	$http.defaults.headers.common['Auth'] = getAuthToken;

	return $resource('/minders/:id', { id: '@id' });

	function getAuthToken() {
		return localStorage.getItem('Auth');
	}
})

.factory('MinderDTO', function ($log, minderResource) {
	function Minder () {
		this.all;
		this.new = {};
	}

	Minder.prototype.query = function () {
		var self = this;
		minderResource.query().$promise
		.then(function onSuccess(success) {
			self.all = JSON.parse(angular.toJson(success));
		}, function onError(error) {
			$log.error(error);
		});
	}

	Minder.prototype.get = function (id) {
		minderResource.get({ id: id }).$promise
		.then(function onSuccess(success) {
			$log.info(success);
		}, function onError(error) {
			$log.error(error);
		})
	}

	Minder.prototype.post = function (newMinder) {
		var self = this;
		minderResource.save( newMinder ).$promise
		.then(function onSuccess(success) {
			$log.info(success);
			self.query();
		}, function onError(error) {
			$log.error(error);
		}).then(function () {
			self.new = {};
		});
	}

	Minder.prototype.completed = function (id) {
		var self = this;
		minderResource.get({ id: id }).$promise
		.then(function onResponce(res) {
			res.completed = JSON.stringify(!res.completed);
			res.$save({ id: id }).then(function onSuccess(success) {
				$log.info(success);
				self.query();
			}, function onError(error) {
				$log.error(error);
			});
		}, function onError(error) {
			$log.error(error);
		});
	}

	Minder.prototype.update = function (id, obj) {
		var self = this;
		minderResource.get({ id: id }).$promise
		.then(function onResponce(res) {
			angular.forEach(obj, function (val, key) {
				res[key] = val;
			})
			res.completed = JSON.stringify(res.completed);
			res.$save({ id: id }).then(function onSuccess(success) {
				$log.info(success);
				self.query();
			});
		}, function onError(error) {
			$log.error(error);
		});
	}

	Minder.prototype.delete = function (id) {
		var self = this;
		minderResource.get({ id: id }).$promise
		.then(function onSuccess(success) {
			$log.info(success);
			success.$delete({ id: id })
			.then(function onSuccess(success) {
				$log.info(success);
				self.query();
			}, function onError(error) {
				$log.error(error);
			});
		}, function onError(error) {
			$log.error(error);
		});
	}

	return Minder;
});