var querystring = require('querystring');

var query = {
	events: function (params) {
		if (typeof params === 'string') {
			return '?event=' + params;
		}

		return '?' + querystring.stringify(params);
	},

	reports: function (params) {
		return '?' + querystring.stringify(params);
	}
};

module.exports = query;