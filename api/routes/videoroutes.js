'use strict';
module.exports = function (app) {
	var videoList = require.main.require('./api/controllers/videocontroller');

	app.route('/api/videos')
		.get(videoList.list_all);

	app.route('/api/videos/:videoId')
		.get(videoList.list);

	app.route('/api/video/total')
		.get(videoList.total);


	app.route('/api/video/blocknumber')
		.get(videoList.blocknumber);
};

