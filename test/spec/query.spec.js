var query = require('../../source/query');

describe('query.spec.js', function () {
	var result;

	describe('for events', function () {

		describe('one event', function () {
			beforeEach(function () {
				result = query.events('simple-event');
			});

			it('should create query', function () {
				expect(result).to.equal('?event=simple-event');
			});
		});

		describe('by date', function () {
			beforeEach(function () {
				result = query.events({date: '2013-12-12'});
			});

			it('should create query', function () {
				expect(result).to.equal('?date=2013-12-12');
			});
		});

		describe('by id and date', function () {
			beforeEach(function () {
				result = query.events({id: 'event-id', date: '2013-12-12'});
			});

			it('should create query', function () {
				expect(result).to.equal('?id=event-id&date=2013-12-12');
			});
		});

		describe('by date and event', function () {
			beforeEach(function () {
				result = query.events({date: '2013-12-12', event: 'event id'});
			});

			it('should create query', function () {
				expect(result).to.equal('?date=2013-12-12&event=event%20id');
			});
		});

	});

	describe('for reports', function () {
		describe('by date', function () {
			beforeEach(function () {
				result = query.reports({report: 'date', date: '2013-12-12'});
			});

			it('should create query', function () {
				expect(result).to.equal('?report=date&date=2013-12-12');
			});
		});

		describe('by hour', function () {
			beforeEach(function () {
				result = query.reports({report: 'hour', hour: 6, date: '2013-12-12'});
			});

			it('should create query', function () {
				expect(result).to.equal('?report=hour&hour=6&date=2013-12-12');
			});
		});

		describe('by week', function () {
			beforeEach(function () {
				result = query.reports({report: 'week', date: '2013-12-12'});
			});

			it('should create query', function () {
				expect(result).to.equal('?report=week&date=2013-12-12');
			});
		});

		describe('by month', function () {
			beforeEach(function () {
				result = query.reports({report: 'month', date: '2013-12-12'});
			});

			it('should create query', function () {
				expect(result).to.equal('?report=month&date=2013-12-12');
			});
		});

		describe('by period', function () {
			beforeEach(function () {
				result = query.reports({report: 'period', from: '2013-12-12', to: '2013-12-13'});
			});

			it('should create query', function () {
				expect(result).to.equal('?report=period&from=2013-12-12&to=2013-12-13');
			});
		});
	});
});