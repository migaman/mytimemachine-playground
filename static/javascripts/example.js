'use strict';

var videoContract;
var myfile;

var Upload = function (file) {
	this.file = file;
};

Upload.prototype.getType = function () {
	return this.file.type;
};
Upload.prototype.getSize = function () {
	return this.file.size;
};
Upload.prototype.getName = function () {
	return this.file.name;
};
Upload.prototype.doUpload = function () {
	var that = this;
	var formData = new FormData();

	// add assoc key values, this will be posts values
	formData.append("videofile", this.file);

	$.ajax({
		type: "POST",
		url: "/api/video/ipfs",
		xhr: function () {
			var myXhr = $.ajaxSettings.xhr();
			if (myXhr.upload) {
				myXhr.upload.addEventListener('progress', that.progressHandling, false);
			}
			return myXhr;
		},
		success: function (data) {
			// your callback here
			console.log("return json:" + JSON.stringify(data));
			var ipfsHash = data[0].hash;
			console.log("hash:" + ipfsHash);

			//Nun in Vertrag speichern mit erhaltenem hash
			uploadVideoClient(ipfsHash);
		},
		error: function (error) {
			// handle error
			console.error('Error occured ajax post' + error);
		},
		async: true,
		data: formData,
		cache: false,
		contentType: false,
		processData: false,
		crossDomain: true,
		timeout: 60000
	});

};

Upload.prototype.progressHandling = function (event) {
	var percent = 0;
	var position = event.loaded || event.position;
	var total = event.total;
	var progress_bar_id = "#progress-wrp";
	if (event.lengthComputable) {
		percent = Math.ceil(position / total * 100);
	}
	// update progressbars classes so it fits your code
	$(progress_bar_id + " .progress-bar").css("width", +percent + "%");
	$(progress_bar_id + " .status").text(percent + "%");
};

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


	//save file in global variable for upload
	$("#filename").on("change", function (e) {
		myfile = $(this)[0].files[0];
	});

});


function uploadVideoClientside() {
	var message = "";
	if (typeof (web3) === "undefined") {
		message = "Unable to find web3. " +
			"Please run MetaMask (or something else that injects web3).";
		console.log(message);
		alert(message);
	}
	else {
		console.log("Web3 is defined...");
		if (web3.isConnected()) {
			console.log("Web3 is connected...");

			var accounts = web3.eth.accounts;
			if (accounts.length > 0) {
				console.log("web3 accounts available");
				var upload = new Upload(myfile);
				upload.doUpload();
			}
			else {
				message = "web3 accounts not available";
				console.log(message);
				alert(message);
			}

		}
		else {
			message = "Web3 is not connected. Please connect it.";
			console.log(message);
			alert(message);
		}
	}
}

function uploadVideoClient(ipfsHash) {
	var idvideo = $('#idvideo').val();
	var secretKey = $('#secretkey').val();
	var releaseDate = $('#releasedate').val();
	var ether = $('#amounteth').val();


	web3 = new Web3(web3.currentProvider);
	//Check if connected to node
	if (!web3.isConnected()) {
		console.log("you are not connected");
		error("you are not connected");
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

		videoContract.addVideo(idvideo, secretKey, releaseDate, ipfsHash, { from: web3.eth.accounts[0], value: ether }, function (error, result) {
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

//not used currently... details of video
function getVideoAttributesServerside() {
	var idvideo = $('#idvideo').val();
	// jQuery AJAX call for JSON
	$.getJSON('/api/videos/' + idvideo, function (jsonVideo) {
		$('#videoinfo').html("id: " + jsonVideo.idvideo + "<br>secretKey:" + jsonVideo.secretKey +
			"<br>releaseDateTime:" + jsonVideo.releaseDateTime + "<br>releaseBlock:" + jsonVideo.releaseBlock +
			"<br>ETH value:" + jsonVideo.ethValue + "<br>Author Address:" + jsonVideo.authorAddress +
			"<br>available:" + jsonVideo.isAvailable +
			"<br>available:" + jsonVideo.ipfsHash
		);
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
			if (colIndex == 7) {
				cellValue = '<a href="https://ipfs.io/ipfs/' + cellValue + '">' + cellValue + '</a>';
				row$.append($('<td/>').html(cellValue));
			}
			else {
				row$.append($('<td/>').html(cellValue));
			}

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


function incrementVideosServerside() {
	$.getJSON('/api/video/incrementcounter', function (transactionHash) {
		console.log("Counter incremented: " + transactionHash);
	});
}