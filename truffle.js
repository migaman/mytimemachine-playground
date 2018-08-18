module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    kovan: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 42,
	  gas: 4700000
    },
	ropsten: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 3,
      gas: 4700000
    }
  }
};