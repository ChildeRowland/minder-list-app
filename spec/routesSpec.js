var request = require('request');


describe('GET /', function () {
	var res;
	var view;

	beforeEach(function (done) {
		request.get('http://localhost:3000/', function (error, response, body) {
			if ( error ) {
				return console.log(error);
			} else {
				res = response;
				view = body;
			}
			
			done();
		});
	});

	it('loads the home page and returns a status code of 200', function (done) {
		expect(res.statusCode).toBe(200);
		done();
	});
	it('returns an html body with the title', function (done) {
		expect(view).toMatch('Reminder Auth');
		done();
	});

});


describe('POST /user', function () {
	var invalidSignup = [
		{},
		{foo: "test1@email.com", bar: "testpass"},
		{email: "", password: ""},
		{email: "test1@email.com", password: ""},
		{email: "", password: "testpass"},
		{email: "test1#email.com", password: "testpass"}
	];

	function addTest (signupObj) {

		describe('loop multiple failing signup objects', function () {

			var res;

			beforeEach(function (done) {
				request({
					url: 'http://localhost:3000/users',
					method: 'POST',
					json: signupObj
				}, function (error, response, body) {
					if ( error ) {
						return console.log(error);
					} else {
						res = response;
					}
					done();
				});
			});

			it('returns status code 400 invalid signup credentials', function () {
				console.log('it func: ', signupObj, res.statusCode);
				expect(res.statusCode).toBe(400);
			});
		});
	}

	invalidSignup.forEach(function (obj) {
		addTest(obj);
	});
});


describe('Sign up, Login', function () {
	var userToken;
	var newUser = {};
	var logUser = {};

	var createOptions = {
		url: 'http://localhost:3000/users',
		method: 'POST',
		json: { 
			email: "test1@email.com", 
			password: "testpass"
		}
	};

	var loginOptions = {
		url: 'http://localhost:3000/users/login',
		method: 'POST',
		json: { 
			email: "test1@email.com", 
			password: "testpass"
		}
	};

	beforeEach(function (done) {

		function createCallback(error, response, body) {
			if ( error ) {
				return console.log(error);
			} else {
				newUser.res = response;
				newUser.view = body;
			}
			done();
		}

		function loginCallback(error, response, body) {
			if ( error ) {
				return console.log(error);
			} else {
				logUser.res = response;
				logUser.view = body;
				userToken = response.headers.auth;
			}
			done();
		}

		request(createOptions, createCallback);
		request(loginOptions, loginCallback);
	});

	afterEach(function (done) {
		request({
			url: 'http://localhost:3000/user',
			method: 'DELETE',
			headers: {
				Auth: userToken
			}
		});
		done();
	});

	it('creates a new user with valid credentials', function (done) {
		expect(newUser.res.statusCode).toBe(200);
		done();
	});

	it('logs in a user with valid credentials', function (done) {
		expect(logUser.res.statusCode).toBe(200);
		done();
	});
});








