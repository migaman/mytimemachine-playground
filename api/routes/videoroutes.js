'use strict';
module.exports = function (app) {
	var videoList = require.main.require('./api/controllers/videoController');

	app.route('/api/videos')
		.get(videoList.list_all);

	app.route('/api/videos/:videoId')
		.get(videoList.list);
};

