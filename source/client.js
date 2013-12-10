var request = require('request');
var query = require('./query');

module.exports = function (app, options) {
	if (!app) {
		throw new Error('application id is required');
	}

	if (!options || !options.credentials) {
		throw new Error('options or credentials are missing');
	}

	var server = (options && options.server) || 'http://localhost:3005';
	var credentials = options.credentials;

	if (!credentials) {
		throw new Error('options object missing service credentials');
	}

	var accessToken;

	function auth(credentials, callback) {
		request.post({url: server + '/auth', body: credentials, json: true}, function (err, response) {
			if (err) {
				return callback(err);
			}

			callback(null, response.body.token);
		});
	}

	function ensureAccessToken(callback) {
		if (!accessToken) {
			return auth(credentials, function (err, token) {
				if (err) {
					return callback(err);
				}

				accessToken = token;

				return callback(null, token);
			});
		}

		callback(null, accessToken);
	}

	var client = function client(event, data, callback) {
		var url = server + '/api/events/' + app;

		if (typeof data === 'function') {
			callback = data;
		}

		ensureAccessToken(function (err, token) {
			if (err) {
				return callback(err);
			}

			request.post({url: url, body: {event: event, data: data}, headers: {'X-Access-Token': token}, json: true}, function (err, resp) {
				if (err) {
					return callback({message: 'error occured during event posting', err: err});
				}

				if (resp.statusCode !== 201) {
					return callback({message: 'server error', code: resp.statusCode, err: resp.body});
				}

				callback(null, resp.body);
			});
		});
	};

	client.query = function(params, callback) {
		var url = server + '/api/events/' + app;

		if (typeof params === 'function') {
			callback = params;
		} else {
			url += query.events(params);
		}

		ensureAccessToken(function (err, token) {
			if (err) {
				return callback(err);
			}

			request.get({url: url, headers: {'X-Access-Token': token}, json: true}, function (err, resp) {
				if (err) {
					return callback({message: 'error occured during getting events', err: err});
				}

				if (resp.statusCode !== 200) {
					return callback({message: 'server error', code: resp.statusCode});
				}

				callback(null, resp.body);
			});
		});
	};

	client.report = function(params, callback) {
		if (!params.report) {
			return callback('missing report option');
		}

		var url = server + '/api/reports/' + params.report + '/' + app;
		url += query.reports(params);

		ensureAccessToken(function (err, token) {
			if (err) {
				return callback(err);
			}

			request.get({url: url, headers: {'X-Access-Token': token}, json: true}, function (err, resp) {
				if (err) {
					return callback({message: 'error occured during getting events', err: err});
				}

				if (resp.statusCode !== 200) {
					return callback({message: 'server error', code: resp.statusCode});
				}

				callback(null, resp.body);
			});
		});
	};

	return client;
};