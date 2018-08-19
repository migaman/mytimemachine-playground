'use strict';


var videomodel = require.main.require('./api/models/videomodel');

exports.list = function (req, res) {
	var Web3 = require('web3');
	//Provider not automatically detected on serverside...
	var httpProvider = process.env.WEB3_HTTP_PROVIDER_SERVERSIDE
	var web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));

	var idvideo = req.params.videoId;

	var jsonContract = require.main.require('./build/contracts/VideoContract.json');
	const EXAMPLE_ADDRESS = process.env.EXAMPLE_CONTRACT_ADDRESS || '0xca4b024f3f7279534ccb5dc4a528c46afa79eed3';
	var videoABI = web3.eth.contract(jsonContract.abi);
	var videoContract = videoABI.at(EXAMPLE_ADDRESS);

	videoContract.getVideoAttributes(idvideo, function (err, result) {
		if (!err) {
			var video = new videomodel();
			video.idvideo = Number(result[0]);
			video.secretKey = result[1];
			video.releaseDateTime = Number(result[2]);
			video.releaseBlock = Number(result[3]);
			video.ethValue = Number(result[4]);
			video.authorAddress = result[5];
			video.isAvailable = Boolean(result[6]);

			res.json(video);

		}
		else {
			console.error(err);
			res.send(err);
		}
	});





};



exports.list_all = function (req, res) {
	var videos = [];

	var video = new videomodel();
	video.idvideo = 1;
	video.videoname = "First steps with ethereum";
	video.videotag = "blockchain";
	videos.push(video);

	var video = new videomodel();
	video.idvideo = 2;
	video.videoname = "Further steps with ethereum";
	video.videotag = "blockchain";
	videos.push(video);

	res.json(videos);


};