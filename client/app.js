angular.module('minderApp', ['ngResource'])

.factory('minderResource', function($resource, $http) {
	$http.defaults.headers.common['Auth'] = getAuthToken;

	return $resource('/minders/:id', { id: '@_id' });

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
			console.log(self.all);
		}, function onError(error) {
			$log.error(error);
		});
	}

	Minder.prototype.save = function (newMinder) {
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
	return Minder;
})


.factory('RequestDTO', function ($http) {

	return {
		dbCall: function (method, url, dataObj, headersObj) {
			return $http({
				method: method,
				url: url,
				data: dataObj,
				headers: headersObj
			});
		}
	};
})

.controller('Main', function ($http, $log, $resource, MinderDTO, RequestDTO, minderResource) {
	var self = this;
	self.welcome = 'Working';
	self.Minder = new MinderDTO;

	self.register = function() {
	  	return $http.post('/users', {
	      	email: self.email,
	      	password: self.password
		}).then(function onSuccess(user) {
			$log.info('user created', user);
		}, function onError(error) {
			$log.error('unable to create user', error);
		});
	};

	self.login = function() {
		return $http.post('/users/login', {
			email: self.email,
			password: self.password
		}).then(function onSuccess(res) {
			var authHeader = res.headers('Auth');
			localStorage.setItem('Auth', authHeader);
			$log.info('user logged in');
		}, function () {
			$log.error('Not able to log in the user');
		});
	};

	self.isCurrentUser = function () {
		return true;
	};

	self.showOne = function (id) {
		minderResource.get({ id: id }).$promise.then(function (res) {
			console.log(res);
		});
	};

	self.markComplete = function (id) {
		minderResource.get({ id: id }).$promise.then(function (res) {
			res.completed = JSON.stringify(!res.completed);
			res.$save({ id: id });
			console.log('Entry Updated');
		});
	};

	self.deleteMinder = function (id) {
		minderResource.get({ id: id }).$promise.then(function (res) {
			res.$delete({ id: id });
		}).then(function onSuccess() {
			self.minder = {};
			console.log('Entry Deleted');
		});
	};

});

