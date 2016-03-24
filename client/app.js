angular.module('minderApp', ['ngResource', 'ngAnimate'])

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
				$log.info('user logged out');
			}, function onError(error) {
				$log.error(error);
			});
	}

	return User;
})

.factory('messages', function () {
	var messages = { 
		list: [],

		add: function (message) {
			messages.list.push({text: message});
		},

		getList: function () {
			return new Promise(function (resolve, reject) {
				resolve(messages.list);
			});
		}
	};
	return messages;
})

.controller('User', function (UserDTO, messages, $rootScope) {
	var self = this;
	self.User = new UserDTO;

	self.addMessage = function (message) {
		messages.add(message);
		self.msg = "";
		console.log(messages.list.length);
	};

	// self.handleMess = function (msg) {
	// 	$scope.$emit('clicked', {message: msg});
	// };
})

.controller('Main', function (MinderDTO, messages, $rootScope) {
	var self = this;
	self.Minder = new MinderDTO;

	$rootScope.$watch(function () {
		return messages.list.length
	}, function () {
		messages.getList().then(function onSuccess(success) {
			return self.mess = success;
		}).then(function () {
			console.log('fired');
		});
	});	
	

	// $scope.$on('clicked', function (event, args) {
	// 	console.log(event, args);
	// 	self.message = args.message;
	// })

	
	self.isLast = function (dateTime) {
		var now = new Date();
		var updated = new Date(dateTime);
		var diff = Math.abs( now - updated );

		if ( diff < 1000 ) {
			return true;
		}
	}

	self.init = function () {
		if ( self.initalLoad === undefined ) {
			return true;
			self.initalLoad = true;
		} else {
			return false;
		}
	}

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

