'use strict';


var videomodel = require.main.require('./api/models/videomodel');
var Web3 = require('web3');
var httpProvider = process.env.WEB3_HTTP_PROVIDER_SERVERSIDE;
var web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
var jsonContract = require.main.require('./build/contracts/VideoContract.json');
const EXAMPLE_CONTRACT_ADDRESS = process.env.EXAMPLE_CONTRACT_ADDRESS || '0xca4b024f3f7279534ccb5dc4a528c46afa79eed3';
const EXAMPLE_ACCOUNT = process.env.EXAMPLE_ACCOUNT || '0xCaea01B825cDf94A362533853320FF173D221B8d';
const EXAMPLE_PRIVATEKEY = process.env.EXAMPLE_PRIVATEKEY || 'd1c20ac3cd7471ca2a6e43bdaa84e4e73b7f4713f8f174c6257639da8e2e9aa7';
var videoContract = new web3.eth.Contract(jsonContract.abi, EXAMPLE_CONTRACT_ADDRESS);
var fs = require('fs');
var ipfsapi = require('ipfs-api');
var EthereumTx = require('ethereumjs-tx')


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


exports.incrementcounter = function (req, res) {

	var address = EXAMPLE_CONTRACT_ADDRESS;
	var account = EXAMPLE_ACCOUNT;

	web3.eth.getTransactionCount(account, function (err, nonce) {

		var data = videoContract.methods.incrementVideos().encodeABI();
		var gasPrice = web3.utils.toHex(web3.utils.toWei('20', 'gwei'));

		const txParams = {
			nonce: nonce,
			gasPrice: gasPrice,
			gasLimit: web3.utils.toHex(250000),
			to: address,
			value: '0x00',
			data: data,
			chainId: '*'
		}

		const tx = new EthereumTx(txParams);
		const privateKey = Buffer.from(EXAMPLE_PRIVATEKEY, 'hex')
		tx.sign(privateKey);
		var raw = '0x' + tx.serialize().toString('hex');

		web3.eth.sendSignedTransaction(raw, function (err, transactionHash) {
			if (!err) {
				res.json(transactionHash);
			}
			else {
				//throw err; // Check for the error and throw if it exists.
				console.error(err);
				res.send(err);
			}
		})

	});



};