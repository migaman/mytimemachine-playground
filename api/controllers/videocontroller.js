'use strict';


var videomodel = require.main.require('./api/models/videomodel');
var Web3 = require('web3');
var httpProvider = process.env.WEB3_HTTP_PROVIDER_SERVERSIDE;
var web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
var jsonContract = require.main.require('./build/contracts/VideoContract.json');
const EXAMPLE_CONTRACT_ADDRESS = process.env.EXAMPLE_CONTRACT_ADDRESS || '0xca4b024f3f7279534ccb5dc4a528c46afa79eed3';
var videoContract = new web3.eth.Contract(jsonContract.abi, EXAMPLE_CONTRACT_ADDRESS);
var fs = require('fs');
var ipfsapi = require('ipfs-api');

exports.addipfs = function (req, res) {
	//req.file.buffer is always undefined. Should work according to docs
	//var buffer = req.file.buffer;

	var buffer = fs.readFileSync(req.file.path);
	var ipfs = new ipfsapi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

	ipfs.add(buffer, (err, ipfsHash) => {
		if (!err) {
			res.json(ipfsHash);
		}
		else {
			console.error(err);
			res.send(err);
		}
	});


};


exports.blocknumber = function (req, res) {
	videoContract.methods.getBlockNumber().call(function (err, result) {
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
	videoContract.methods.getTotalVideos().call(function (err, result) {
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
	var videos = [];
	videoContract.methods.getVideoIds().call(function (err, result) {
		if (!err) {
			var waiting = result.length;
			for (var i = 0; i < result.length; i++) {
				var idvideo = result[i];

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
	videoContract.methods.getVideoAttributes(idvideo).call(function (err, result) {
		if (!err) {
			var video = new videomodel();
			video.idvideo = Number(result[0]);
			video.secretKey = result[1];
			video.releaseDateTime = Number(result[2]);
			video.releaseBlock = Number(result[3]);
			video.ethValue = Number(result[4]);
			video.authorAddress = result[5];
			video.isAvailable = Boolean(result[6]);
			video.ipfsHash = result[7];

			// error is the first argument
			callback(null, video);
		}
		else {
			callback(err, null);
		}
	});
}