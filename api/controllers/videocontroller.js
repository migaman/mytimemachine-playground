'use strict';


var videomodel = require.main.require('./api/models/videomodel');



exports.blocknumber = function (req, res) {
	var Web3 = require('web3');
	var httpProvider = process.env.WEB3_HTTP_PROVIDER_SERVERSIDE
	var web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));

	var jsonContract = require.main.require('./build/contracts/VideoContract.json');
	const EXAMPLE_ADDRESS = process.env.EXAMPLE_CONTRACT_ADDRESS || '0xca4b024f3f7279534ccb5dc4a528c46afa79eed3';
	var videoABI = web3.eth.contract(jsonContract.abi);
	var videoContract = videoABI.at(EXAMPLE_ADDRESS);

	videoContract.getBlockNumber(function (err, result) {
		if (!err) {
			res.json(result);
		}
		else {
			console.error(err);
			res.send(err);
		}
	});


};

exports.total = function (req, res) {
	var Web3 = require('web3');
	var httpProvider = process.env.WEB3_HTTP_PROVIDER_SERVERSIDE
	var web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));

	var jsonContract = require.main.require('./build/contracts/VideoContract.json');
	const EXAMPLE_ADDRESS = process.env.EXAMPLE_CONTRACT_ADDRESS || '0xca4b024f3f7279534ccb5dc4a528c46afa79eed3';
	var videoABI = web3.eth.contract(jsonContract.abi);
	var videoContract = videoABI.at(EXAMPLE_ADDRESS);

	videoContract.getTotalVideos(function (err, result) {
		if (!err) {
			res.json(result);
		}
		else {
			console.error(err);
			res.send(err);
		}
	});
};


exports.list = function (req, res) {
	var idvideo = req.params.videoId;

	getVideo(idvideo, function (err, data) {
		if (!err) {
			res.json(data);
		}
		else {
			//throw err; // Check for the error and throw if it exists.
			console.error(err);
			res.send(err);
		}
	});
};




//Lists all videos in contract
exports.list_all = function (req, res) {
	var Web3 = require('web3');
	//Provider not automatically detected on serverside...
	var httpProvider = process.env.WEB3_HTTP_PROVIDER_SERVERSIDE
	var web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));


	var jsonContract = require.main.require('./build/contracts/VideoContract.json');
	const EXAMPLE_ADDRESS = process.env.EXAMPLE_CONTRACT_ADDRESS || '0xca4b024f3f7279534ccb5dc4a528c46afa79eed3';
	var videoABI = web3.eth.contract(jsonContract.abi);
	var videoContract = videoABI.at(EXAMPLE_ADDRESS);

	var videos = [];

	videoContract.getVideoIds(function (err, result) {
		if (!err) {
			var waiting = result.length;
			for (var i = 0; i < result.length; i++) {
				var idvideo = result[i].toNumber();

				getVideo(idvideo, function (err, data) {
					if (!err) {
						//res.json(data);
						waiting--;
						videos.push(data);

						if (waiting === 0) {
							//last element reached. callback!!
							res.json(videos);
						}
					}
					else {
						//throw err; // Check for the error and throw if it exists.
						console.error(err);
						res.send(err);
					}
				});
			}
		}
		else {
			console.error(err);
			res.send(err);
		}
	});

};







function getVideo(idvideo, callback) {
	var Web3 = require('web3');
	var httpProvider = process.env.WEB3_HTTP_PROVIDER_SERVERSIDE
	var web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
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

			// error is the first argument
			callback(null, video);
		}
		else {
			callback(err, null);
		}
	});
}