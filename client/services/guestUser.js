angular.module('minderApp')

.factory('GuestUser', function() {
	guestUser = {
		password: 'testpass'
	};

	guestUser.email = function () {
		var emailLength = Math.ceil( Math.random() * 4 + 6 );
		var letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
		var arr = [];

		for ( var i = 0; i < emailLength; i++) {
			var idx = Math.floor( Math.random() * 26 );
			arr.push(letters[idx]);
		}
		return arr.join('') + '@email.com';
	};

	return guestUser;
})