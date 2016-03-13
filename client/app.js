angular.module('minderApp', [])

.factory('AuthTokenDTO', function ($window) {
	var store = $window.localStorage;

	return {
		setToken: function (token) {
			if (token) {

			}
		}
	}
})

.controller('Main', function ($http) {
	var self = this;
	self.welcome = 'Working';

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
		var access = localStorage.getItem('Auth');
		return $http({
			method: 'POST',
			url: 'minders',
			data: { description: 'Who dat Ninja?' },
			headers: { 'Auth': access }
		})
	};
});

//localStorage.getItem('Auth');