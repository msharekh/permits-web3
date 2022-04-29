App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load permits.
    $.getJSON('../permits.json', function (data) {
      var permitsRow = $('#permitsRow');
      var permitTemplate = $('#permitTemplate');

      for (i = 0; i < data.length; i++) {
        permitTemplate.find('.panel-title').text(data[i].name);
        permitTemplate.find('img').attr('src', data[i].picture);
        permitTemplate.find('.permit-breed').text(data[i].breed);
        permitTemplate.find('.permit-age').text(data[i].age);
        permitTemplate.find('.permit-location').text(data[i].location);
        permitTemplate.find('.btn-permit').attr('data-id', data[i].id);

        permitsRow.append(permitTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  setAccountLabel: async function () {
    // set account label
    $('#accval').text('gooood');
  },

  initWeb3: async function () {
    /*
     * Replace me...
     */
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
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

    var accounts = web3.eth.accounts;
    var selectedAddress = web3.currentProvider.selectedAddress;
    $('#accountval').text(`address: ${selectedAddress.substr(0,7)}`);

    


    return App.initContract();
  },

  initContract: function () {
    /*
     * Replace me...
     */

    $.getJSON('permits.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var PermitionArtifact = data;
      App.contracts.Permition = TruffleContract(PermitionArtifact);

      // Set the provider for our contract
      App.contracts.Permition.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the permited permits
      return App.markPermited();
    });


    return App.bindEvents();
  },

  bindEvents: function () {

    $(document).on('click', '.btn-permit', App.handlePermit);
  },

  markPermited: function () {
    /*
     * Replace me...
     */
    
    var permitionInstance;

    App.contracts.Permition.deployed().then(function (instance) {
      $('#contractval').text(`contract: ${instance.address.substr(0,7)}`);
      permitionInstance = instance;

      return permitionInstance.getPermitOwners.call();
    }).then(function (permitOwners) {
      console.log(permitOwners);
      for (i = 0; i < permitOwners.length; i++) {
        if (permitOwners[i] !== '0x0000000000000000000000000000000000000000') {
          
          $('.panel-Permit').eq(i).find('.permit-owner').text(permitOwners[i].substr(0,7));

          $('.panel-Permit').eq(i).find('button').text('Success').attr('disabled', true);

        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });

  },

  handlePermit: function (event) {
    event.preventDefault();

    var permitId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */

    var permitionInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

       
      console.log(account);

      App.contracts.Permition.deployed().then(function (instance) {
        permitionInstance = instance;

        // Execute permit as a transaction by sending account
        return permitionInstance.permit(permitId, { from: account });
      }).then(function (result) {
        return App.markPermited();
      }).catch(function (err) {
        console.log(err.message);
      });
    });

  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
