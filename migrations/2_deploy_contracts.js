var videoContract = artifacts.require("./VideoContract.sol");

module.exports = function (deployer, helper, accounts) {
	deployer.deploy(videoContract);
}