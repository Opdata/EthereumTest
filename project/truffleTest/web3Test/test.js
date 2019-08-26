import Web3 from "./web3";

typeof web3 !== 'undefined'
? (web3 = new Web3(web3.currentProvider))
: (web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')));
  web3 = new Web3(web3.currentProvider)
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

  if(Web3.isConnectd()){
    console.log('complete');
    }