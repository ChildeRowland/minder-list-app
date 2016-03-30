angular.module('minderApp', ['ngResource', 'ngAnimate'])

.controller('User', function (UserDTO, GuestUser) {
	var self = this;
	self.User = new UserDTO;

	self.register = function () {
		self.User.current = {
			email: GuestUser.email(),
			password: GuestUser.password
		};
		self.User.register();
	};
})

.controller('Main', function (MinderDTO, $rootScope) {
	var self = this;
	self.Minder = new MinderDTO;

	// watch for user, then fetch user list
	$rootScope.$watch(function () { 
		return localStorage['Auth'];
		}, function (newVal, oldVal) {
			if ( newVal ) {
				self.Minder.query();
			}
	}, true);

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

	// add properties to user obj for ngClass
	self.isLast = function (dateTime) {
		var now = new Date();
		var updated = new Date(dateTime);
		var diff = Math.abs( now - updated );

		if ( diff < 1000 ) {
			return true;
		}
	};

	delete localStorage['Auth'];
});

// examples


	// .factory('messages', function () {
	// 	var messages = { 
	// 		list: [],

	// 		add: function (message) {
	// 			messages.list.push({text: message});
	// 		},

	// 		getList: function () {
	// 			return new Promise(function (resolve, reject) {
	// 				resolve(messages.list);
	// 			});
	// 		}
	// 	};
	// 	return messages;
	// })

	// self.addMessage = function (message) {
	// 	messages.add(message);
	// 	self.msg = "";
	// 	console.log(messages.list.length);
	// };

	// Watch for user, and get their minder list.
	// $rootScope.$watch(function () {
	// 	return messages.list.length
	// }, function () {
	// 	messages.getList().then(function onSuccess(success) {
	// 		return self.mess = success;
	// 	}).then(function () {
	// 		console.log('fired');
	// 	});
	// });


	// self.handleMess = function (msg) {
	// 	$scope.$emit('clicked', {message: msg});
	// };

	// $scope.$on('clicked', function (event, args) {
	// 	console.log(event, args);
	// 	self.message = args.message;
	// });