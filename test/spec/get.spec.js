var moment = require('moment');
var client = require('../../source/client');
var async = require('async');

describe('quering events', function () {
	var app, events, error, options, results;

	before(function () {
		options = {
			credentials: {
				username: 'seismo',
				password: 'mypass'
			}
		};
	});

	before(function () {
		app = 'test-quering-app-' + moment().valueOf();
	});

	before(function () {
		events = client(app, options);
	});

	before(function (done) {
		async.each(['application started', 'application stopped', 'application started'], postEvent, function(err) {
			console.log(err);
			done(err);
		});

		function postEvent(event, callback) {
			events(event, callback);
		}
	});

	describe('all events', function () {
		before(function (done) {
			events.query(function (err, res) {
				error = err;
				results = res;
				done(err);
			});
		});

		it('should return all events for app', function () {
			expect(results.length).to.equal(3);
		});
	});

	describe('by event name', function () {
		before(function (done) {
			events.query('application started', function (err, res) {
				error = err;
				results = res;
				done(err);
			});
		});

		it('should return all events by given name', function () {
			expect(results.length).to.equal(2);
		});
	});

	describe('by event id', function () {
		before(function (done) {
			events.query({id: 'application-stopped'}, function (err, res) {
				error = err;
				results = res;
				done(err);
			});
		});

		it('should return all events by given id', function () {
			expect(results.length).to.equal(1);
		});
	});

	describe('by today', function () {
		before(function (done) {
			events.query({date: 'today'}, function (err, res) {
				error = err;
				results = res;
				done(err);
			});
		});

		it('should return all events by today', function () {
			expect(results.length).to.equal(3);
		});
	});
});