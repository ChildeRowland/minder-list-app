angular.module('minderApp', ['ngResource'])

.factory('minderResource', function($resource) {

	return $resource('/minders/:id', { id: '@_id' }, {
		query: {
			method: 'GET',
			isArray: true,
			headers: { 'Auth': getAuthToken }
		},
		get: {
			method: 'GET',
			headers: { 'Auth': getAuthToken }
		},
		post: {
			method: 'POST',
			headers: { 'Auth': getAuthToken }
		},
		save: {
			method: 'PUT',
			headers: { 'Auth': getAuthToken }
		},
		delete: {
			method: 'DELETE',
			headers: { 'Auth': getAuthToken }
		}
	});

	function getAuthToken() {
		return localStorage.getItem('Auth');
	}

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

.controller('Main', function ($http, $log, $resource, RequestDTO, minderResource) {
	var self = this;
	self.welcome = 'Working';
	self.results;
	self.oneResult;
	self.minder = {};

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

	self.postMinder = function () {
		minderResource.post( self.minder ).$promise.then(function () {
			console.log('posted');
			minderResource.query().$promise.then(function onSuccess (res) {
				self.results = res;
			});
		});
	};

	self.showOne = function (id) {
		minderResource.get({ id: id }).$promise.then(function (res) {
			console.log(res);
		});
	};

	self.markComplete = function (id) {
		// RequestDTO.dbCall('PUT', '/minders/' + id, {"completed": "true"}, { 'Auth': localStorage.getItem('Auth')});
		minderResource.get({ id: id }).$promise.then(function (res) {
			res['completed'] = 'true';
			res.$save({ id: id });
			console.log('Entry Saved');
		});
	};

	self.deleteMinder = function (id) {
		minderResource.get({ id: id }).$promise.then(function (res) {
			res.$delete({ id: id });
			console.log('Entry Deleted');
		});
	};

});

