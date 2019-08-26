App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          await ethereum.enable()
          console.log('1Non-Ethereum browser detected.')
        } catch (error) {
          console.log(error)
        }
      }
      else if (window.web3) {
        console.log('Non-Ethereum browser detected.')
        window.web3 = new Web3(web3.currentProvider)
      }
      else {
        console.log('Non-Ethereum browser detected.')
      }
    })

    return App.initContract();
  },

  initContract: function() {
     $.getJSON('UnivLedger.json', function(data) {
        var testArtifact = data;
        App.contracts.UnivLedger = TruffleContract(testArtifact);
        App.contracts.UnivLedger.setProvider(web3.currentProvider);

        App.bindEvents();
      })
    },

  bindEvents: function() {
    var contractInstance;

    App.contracts.UnivLedger.deployed().then( function(instance) {
      contractInstance = instance;
      const ipfs = new Ipfs({ repo: 'ipfs-' + Math.random() })

      $('#uploadButton').on('click', () => {
        let reader = new FileReader()

        reader.onload = async () => {
          var buffer = window.Ipfs.Buffer.from(btoa(reader.result),'base64');
          const files = await ipfs.add(buffer)
          await contractInstance.registerImage(files[0].hash)
        }
        const fileUpload = document.getElementById('fileUpload')
        reader.readAsBinaryString(fileUpload.files[0])
      })
      $('#loadButton').on('click', async () => {
        let ipfsImage = await contractInstance.getImage($('#loadText').val())
        const file = await ipfs.cat(ipfsImage)
        const img = file.toString("base64")
        $('#loadImage').attr('src', 'data:image/png;base64,' + img)
      })
    })
  },
  
  getFileCnt: async function(){
    App.contracts.UnivLedger.deployed().then( async function(instance) {
      contractInstance = instance;
      alert("tss");
      var num = await contractInstance.getIpfsCnt.call();
      alert("ttttt");
      document.getElementById("tx1").textContent = num;
    })
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
