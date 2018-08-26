'use strict';

var videoContract;

$(document).ready(function () {
	$.getJSON('/api/video/blocknumber', function (blocknumber) {
		$('#blocknumber').text(blocknumber);

	});

	$.getJSON('/api/video/total', function (totalVideos) {
		$('#totalvidoes').text(totalVideos);

	});

	$.getJSON('/api/videos', function (result) {
		buildHtmlTable('#videosinfo', result);
	});

});


function uploadVideoClientside() {
	var idvideo = $('#idvideo').val();
	var secretKey = $('#secretkey').val();
	var releaseDate = $('#releasedate').val();
	var ether = $('#amounteth').val();

	web3 = new Web3(web3.currentProvider);
	//Check if connected to node
	if (!web3.isConnected()) {
		console.log("you are not connected");
	}

	var firstAccount = web3.eth.accounts[0];
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

		videoContract.addVideo(idvideo, secretKey, releaseDate, { from: web3.eth.accounts[0], value: ether }, function (error, result) {
			if (!error) {
				console.log("Upload video: " + result)
			}
			else {
				console.error(error);
			}
		});


	});


}

function uploadVideoServerside() {
	alert("todo!!");
	var idvideo = $('#idvideo').val();
	var secretKey = $('#secretkey').val();
	var releaseDate = $('#releasedate').val();
	var ether = $('#amounteth').val();

	//TODO....
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






// Builds the HTML Table out of myList.
function buildHtmlTable(selector, myList) {
	var columns = addAllColumnHeaders(myList, selector);

	for (var i = 0; i < myList.length; i++) {
		var row$ = $('<tr/>');
		for (var colIndex = 0; colIndex < columns.length; colIndex++) {
			var cellValue = myList[i][columns[colIndex]];
			if (cellValue == null) cellValue = "";
			row$.append($('<td/>').html(cellValue));
		}
		$(selector).append(row$);
	}
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(myList, selector) {
	var columnSet = [];
	var headerTr$ = $('<tr/>');

	for (var i = 0; i < myList.length; i++) {
		var rowHash = myList[i];
		for (var key in rowHash) {
			if ($.inArray(key, columnSet) == -1) {
				columnSet.push(key);
				headerTr$.append($('<th/>').html(key));
			}
		}
	}
	$(selector).append(headerTr$);

	return columnSet;
}

