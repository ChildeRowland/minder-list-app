angular.module('minderApp', ['ngResource'])

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
				$log.info('user created', user)
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
			}, function onError(error) {
				$log.error('Not able to log in the user', error);
			});
	}

	return User;
})

.controller('User', function ($log, UserDTO) {
	var self = this;
	self.User = new UserDTO;

	// self.register = function () {
	// 	userResource.register.save( self.user ).$promise
	// 		.then(function onSuccess(user) {
	// 			$log.info('user created', user)
	// 		}, function onError(error) {
	// 			$log.error('unable to create the user', error);
	// 		});
	// };

	// self.login = function () {
	// 	userResource.login.save( self.user ).$promise
	// 		.then(function onSuccess(res) {
	// 			var authHeader = res.headers('Auth');
	// 			localStorage.setItem('Auth', authHeader);
	// 			$log.info('user logged in');
	// 		}, function onError(error) {
	// 			$log.error('Not able to log in the user', error);
	// 		});
	// };

})

.controller('Main', function (MinderDTO) {
	var self = this;
	self.welcome = 'Working';
	self.Minder = new MinderDTO;

	// self.register = function() {
	//   	return $http.post('/users', {
	//       	email: self.email,
	//       	password: self.password
	// 	}).then(function onSuccess(user) {
	// 		$log.info('user created', user);
	// 	}, function onError(error) {
	// 		$log.error('unable to create user', error);
	// 	});
	// };

	// self.login = function() {
	// 	return $http.post('/users/login', {
	// 		email: self.email,
	// 		password: self.password
	// 	}).then(function onSuccess(res) {
	// 		var authHeader = res.headers('Auth');
	// 		localStorage.setItem('Auth', authHeader);
	// 		$log.info('user logged in');
	// 	}, function onError(error) {
	// 		$log.error('Not able to log in the user', error);
	// 	});
	// };

	self.editForm = function (idx) {
		var minderObj = self.Minder.all[idx];
		minderObj.isEditable = !minderObj.isEditable;
		minderObj.newDesc = angular.copy(minderObj.description);
	};

	self.isCurrentUser = function () {
		if ( localStorage['Auth'] ) {
			return true;	
		} else {
			return false;
		}
	};

	delete localStorage['Auth'];
});

