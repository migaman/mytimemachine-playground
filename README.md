# mytimemachine-playground

Playground for mytimemachine contract

## Whats used for it?
- [ejs](https://github.com/mde/ejs)                 Embedded JavaScript templates
- [env2](https://github.com/dwyl/env2)			    Simple environment variable loader for Node.js
- [Express](https://github.com/expressjs/express) 	Minimalist web framework for Node.js
- [web3](https://github.com/ethereum/web3.js)	    Ethereum JavaScript API

## Steps (Windows)

 Start Ganache GUI
    
    truffle.cmd migrate --reset
    Remember Example Contract address

 Configure .env file
    Rename .env.example to .env
    Set example Contract address
	
Start webapp
    
    npm start
    
Open Browser 
    
    http://localhost:3000/


Open MetaMask with Mnemonic from Ganache
    


### Nonce error

Nonce error in MetaMask during sending. -> Reset Account in MetaMask Settings.
	

