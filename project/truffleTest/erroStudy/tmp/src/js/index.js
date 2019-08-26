App = {
    web3Provider: null,
    contracts: {},

    initWeb3: async function () {
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: async =>{
        $.getJSON('myContract.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            let myContractArtifact = data;
            App.contracts.myContract = TruffleContract(myContractArtifact);

            // Set the provider for our contract
            App.contracts.myContract.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.bindButtonEvent();
        });
    },

    bindButtonEvent: async =>{
        $('#errorHandling').on('click', event => {
            App.handleButtonWithdraw(event);
        });

        $('#eventHandling').on('click', event => {
            App.handleButtonEventEmmit(event);
        });

        $('#eventTrigger').on('click', event => {
            App.handleButtonTriggerEvent(event);
        });
        
    },


    handleButtonWithdraw: async event => {
        event.preventDefault();
        let myContractInstance;

        App.contracts.myContract.deployed().then(async function(instance) {
            try {
                myContractInstance = instance;

                await myContractInstance.withdraw();
            } catch (err) {
                const msg = err.message;
                if (msg.indexOf('revert') != -1) {
                    const customErrStart = msg.indexOf('revert') + 'revert'.length;
                    const customErrMsg = msg.substr(customErrStart).trim();
                    window.alert(customErrMsg);
                } else {
                    console.log(msg);
                }
            }
        });

    },

    handleButtonEventEmmit: async event => {
        event.preventDefault();
        App.contracts.myContract.deployed().then(async function(instance) {
            let myContractInstance = instance;
            let event = myContractInstance.DepositEvent({ senderAddress: [
                '0xE81fEb264D66aF5152ed97E87Fa58cA6B2B73215'
                ]},{ fromBlock: 0, toBlock: 'latest' });

                event.watch((error, result) => { 
                if(!error) {
                    console.log(`Time: ${result.args.time}`);
                    console.log(`Block Number: ${result.args.blockNumber}`); 
                    console.log(`Sender Address: ${result.args.senderAddress}`); 
                    console.log(`Value Wei: ${result.args.valueWei}`);
                } 
            });
        });
    },

    handleButtonTriggerEvent: async event => {
        event.preventDefault();
        App.contracts.myContract.deployed().then(async function(instance) {
            let myContractInstance = instance;
          

            await myContractInstance.deposit();
        });
    }
};

$(function () {
    $(window).load(function () {
        App.initWeb3();
    });
});
