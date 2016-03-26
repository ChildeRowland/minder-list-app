angular.module('minderApp')

.factory('userResource', function ($resource) {
	userResource = {};
	userResource.register = $resource('/users');
	userResource.login = $resource('/users/login', {}, {
		save: {
			method: 'POST',
			transformResponse: function (data, headers) {
				response = {};
				response.data = data;
				response.headers = headers;
				return response;
			}
		},
		delete: {
			method: 'DELETE',
			isArray: false
		}
	});
	
	return userResource;
})

.factory('UserDTO', function ($log, userResource) {
	
	function User () {
		current = {};
	}

	User.prototype.register = function () {
		var self = this;
		userResource.register.save( self.current ).$promise
			.then(function onSuccess(user) {
				$log.info('user created', user);
				return self.login();
			}, function onError(error) {
				$log.error('unable to create the user', error);
			});
	}

	User.prototype.login = function () {
		var	self = this;
		userResource.login.save( self.current ).$promise
			.then(function onSuccess(res) {
				var authHeader = res.headers('Auth');
				localStorage.setItem('Auth', authHeader);
				$log.info('user logged in');
				self.current = {};
			}, function onError(error) {
				$log.error('Not able to log in the user', error);
			});
	}

	User.prototype.logout = function () {
		var self = this;
		userResource.login.delete().$promise
			.then(function onSuccess(res) {
				delete localStorage['Auth'];
				$log.info('user logged out');
			}, function onError(error) {
				$log.error(error);
			});
	}

	return User;
});