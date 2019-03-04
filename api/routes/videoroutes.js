'use strict';
module.exports = function (app) {
	var videoController = require.main.require('./api/controllers/videocontroller');
	var multer = require('multer');
	var upload = multer({ dest: 'uploads/' })

	app.route('/api/videos')
		.get(videoController.listall);

	app.route('/api/videos/:videoId')
		.get(videoController.list);

	app.route('/api/video/total')
		.get(videoController.total);

	app.route('/api/video/blocknumber')
		.get(videoController.blocknumber);


	//POST 
	app.post('/api/video/uploadvideo', function (req, res) {
		videoController.uploadvideo(req, res);
	});

	app.route('/api/video/ipfs')
		.post(upload.single('videofile'), videoController.addipfs);

};

