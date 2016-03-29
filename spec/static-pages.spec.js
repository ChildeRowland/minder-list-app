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

