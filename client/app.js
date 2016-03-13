angular.module('minderApp', [])

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

.controller('Main', function ($http, RequestDTO) {
	var self = this;
	self.welcome = 'Working';
	self.minder = {};

	self.register = function() {
	  	return $http.post('/users', {
	      	email: self.email,
	      	password: self.password
		})
	};

	self.login = function() {
		return $http.post('/users/login', {
			email: self.email,
			password: self.password
		}).then(function onSuccess(res) {
			var authHeader = res.headers('Auth');
			localStorage.setItem('Auth', authHeader);
			console.log(localStorage);
		});
	};

	self.postMinder = function () {
		RequestDTO.dbCall('POST', 'minders', 
		{ description: self.minder.description }, 
		{ 'Auth': localStorage.getItem('Auth')}
		).then(function () {
			self.allMinders();
		});
	};

	self.results;

	self.allMinders = function () {
		RequestDTO.dbCall('GET', 'minders', null, 
		{ 'Auth': localStorage.getItem('Auth') }).then(function (res) {
			self.results = res.data;
		});
	}

	// self.postMinder = function () {
	// 	var access = localStorage.getItem('Auth');
	// 	return $http({
	// 		method: 'POST',
	// 		url: 'minders',
	// 		data: { description: 'Who dat Ninja?' },
	// 		headers: { 'Auth': access }
	// 	})
	// };
});

//localStorage.getItem('Auth');