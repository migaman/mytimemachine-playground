var videoContract;

$(document).ready(function () {
	var version = 0;
	web3 = new Web3(web3.currentProvider);

	//Check if connected to node
	if (!web3.isConnected()) {
		alert("you are not connected");
	}

	version = web3.version.api;
	console.log("version :" + version); // "0.2.0"

	web3.version.getNode(function (error, result) {
		if (!error) {
			console.log("node: " + result)
		}
		else {
			console.error(error);
		}
	});

	web3.version.getNetwork(function (error, result) {
		if (!error) {
			console.log("network: " + result)
		}
		else {
			console.error(error);
		}
	});

	web3.version.getEthereum(function (error, result) {
		if (!error) {
			console.log("version ethereum: " + result)
		}
		else {
			console.error(error);
		}
	});




	firstAccount = web3.eth.accounts[0];
	console.log("First account address: " + firstAccount);

	web3.eth.getBalance(web3.eth.accounts[0], function (error, balance) {
		if (!error) {
			console.log("Balance Account 0: " + balance); // instanceof BigNumber
		}
		else {
			console.error(error);
		}


	});


	web3.eth.getTransactionCount(web3.eth.accounts[0], function (error, counter) {
		if (!error) {
			console.log("Transaction Count:" + counter); // instanceof BigNumber
		}
		else {
			console.error(error);
		}


	});





	$.getJSON("contracts/VideoContract.json", function (jsonContract) {
		var videoABI = web3.eth.contract(jsonContract.abi);
		videoContract = videoABI.at(local_address);
		console.log("contract loaded");

		videoContract.getBlockNumber(function (error, result) {
			if (!error) {
				console.log("Blocknumber: " + result)
				$('#blocknumber').text(result);
			}
			else
				console.error(error);
		});

	});

});


function uploadVideo() {
	var idvideo = $('#idvideo').val();
	var secretKey = $('#secretkey').val();
	var releaseDate = $('#releasedate').val();
	var ether = $('#amounteth').val();

	videoContract.addVideo(idvideo, secretKey, releaseDate, { from: web3.eth.accounts[0], value: ether }, function (error, result) {
		if (!error) {
			console.log("Upload video: " + result)
		}
		else {
			console.error(error);
		}
	});
}


function getVideoAttributesClientside() {

	var idvideo = $('#idvideo').val();

	videoContract.getVideoAttributes(idvideo, function (error, result) {
		if (!error) {
			$('#videoinfo').html("id: " + result[0] + "<br>secretKey:" + result[1] +
				"<br>releaseDateTime:" + result[2] + "<br>releaseBlock:" + result[3] +
				"<br>ETH value:" + result[4] + "<br>Author Address:" + result[5] +
				"<br>available:" + result[6]);

		}
		else {
			console.error(error);
		}
	});
}


function getVideoAttributesServerside() {
	var idvideo = $('#idvideo').val();
	// jQuery AJAX call for JSON
	$.getJSON('/api/videos/' + idvideo, function (jsonVideo) {
		$('#videoinfo').html("id: " + jsonVideo.idvideo + "<br>secretKey:" + jsonVideo.secretKey +
			"<br>releaseDateTime:" + jsonVideo.releaseDateTime + "<br>releaseBlock:" + jsonVideo.releaseBlock +
			"<br>ETH value:" + jsonVideo.ethValue + "<br>Author Address:" + jsonVideo.authorAddress +
			"<br>available:" + jsonVideo.isAvailable);
	});

}


function releaseVideo() {
	var idvideo = $('#idvideo').val();
	alert("todo!!");

}


