App = {
  web3Provider: null,
  contracts: {},

  init: async function() {   //web3가 구동될 때 가장먼저 실행되는 main과 같은 함수가 init함수이다 이게 먼저 실행되게 된다
    // Load pets.
    $.getJSON('../pets.json', function(data) {  
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    /*
     * Replace me...
     */
    if (window.ethereum) { //대부분의 모던 web에서는 여기서 설정이 된다
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
    else if (window.web3) {  //일부 잘 안쓰는 오페라 브라우저 같은것들은 여기서 설정이 되게 된다
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {  //만약 잘 못잡으면 localhost로 연결하는 것이다.
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();   //위에 function이 실행되고 그 다음 initContract함수가 실행된다.
  },

  initContract: function() {
    /*
     * Replace me...
     */
    $.getJSON('Adoption.json', function(data) {  //Adoption 코드를 배포한 다음에 빌드로 생성된 abi코드를 가져와서 
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);  //트러플 내장 함수인 TruffleContract함수로 이 json파일을 보낸다
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);  //???
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
    
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();  //view func은 .Call 로 호출한다?

    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {   //주소는 초기화가 0번째 주소로 초기화가 되나봐? => address(0) => 비어있는 주소값이라고 생각하면 된다 (초기화된것임!)
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);  //그래서 주소값이 0이 아닌것에 대해서는 채택 됐다고 생각되는 것이므로 
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
    
        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});