# Truffle Introduction 

https://trufflesuite.com/

1. Setting up the development environment
1. Creating a Truffle project using a Truffle Box
1. Writing the smart contract
1. Compiling and migrating the smart contract
1. Testing the smart contract
1. Creating a user interface to interact with the smart contract
1. Interacting with the dapp in a browser


# FACTS
- Immutable ثابت
- decentralized
- when contract deployed constructor run
- contract is like wallet address and people can send it money


# Setting up the development environment

```npm install -g truffle```

```
Truffle v5.5.2 (core: 5.5.2)
Ganache v7.0.1
Solidity v0.5.16 (solc-js)
Node v16.14.0
Web3.js v1.5.3
```

## Common NPM script
collapse js: ctrl+k+N
[javascripttutorial](https://www.javascripttutorial.net/nodejs-tutorial/npm-list/
)
  ### Listing packages in devDependencies
  `npm list --dev`
  ### Formatting installed packages in JSON format
  `npm list --depth=0 --json`
  
```json
{
  "version": "1.0.0",
  "name": "permits-web3",
  "dependencies": {
    "lite-server": {
      "version": "2.4.0",
      "resolved": "https://registry.npmjs.org/lite-server/-/lite-server-2.4.0.tgz"
    }
  }
}
```

### Listing packages in devDependencies
`npm list --dev`  
### Listing packages in devDependencies
`npm list --dev`  

### Listing packages in devDependencies
`npm list --dev`  


# Creating a Truffle project using a Truffle Box

```
mkdir permits-web3

cd permits-web3
```
```truffle unbox permit-shop```

## Directory structure¶
The default Truffle directory structure contains the following:

- `contracts`/: Contains the Solidity source files for our smart contracts. There is an important contract in here called `Migrations`.sol, which we'll talk about later.
- `migrations`/: Truffle uses a migration system to handle smart contract deployments. 

    A migration is an additional special smart contract that keeps track of changes.
- `test`/: Contains both JavaScript and Solidity tests for our smart contracts
- `truffle-config.js`: Truffle configuration file

# Writing the smart contract

- Create a new file named `Permition.sol` in the contracts/ directory.
## Variable setup

```address[16] public permitOwners;```

## Your first function: Permitting a Permit
```js
// Permitting a Permit
function permit(uint256 permitId) public returns (uint256) {
        require(permitId >= 0 && permitId <= 15);

        permitOwners[permitId] = msg.sender;

        return permitId;
    }
```

## Your second function: Retrieving the permitOwners

```js
// Retrieving the permitOwners
function getPermitOwners() public view returns (address[16] memory) {
        return permitOwners;
    }
```

# Compiling and migrating the smart contract

## Compilation

```truffle compile```

```
Compiling your contracts...
===========================
> Compiling ./contracts/Permition.sol
> Compiling ./contracts/Migrations.sol
> Artifacts written to /Users/msh/development/permit-shop-tutorial/build/contracts
```

## Migration

Now we are ready to create our own migration script.

- Create a new file named `2_deploy_contracts.js` in the migrations/ directory.

- Add the following content to the 2_deploy_contracts.js file:


```js
var Permition = artifacts.require("Permition");

module.exports = function(deployer) {
  deployer.deploy(Permition);
};
```
```truffle migrate```

# Testing the smart contract
## Testing the smart contract using JavaScript¶

Create a new file named `testPermition.test.js` in the `test/` directory.


 

`truffle test`



# Creating a user interface to interact with the smart contract

Included with the permit-shop Truffle Box was code for the app's front-end. That code exists within the `src/` directory.

## Instantiating web3
Open /src/js/app.js in a text editor.

```js
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

```

## Instantiating the contract

```js
$.getJSON('Permition.json', function(data) {
  // Get the necessary contract artifact file and instantiate it with @truffle/contract
  var PermitionArtifact = data;
  App.contracts.Permition = TruffleContract(PermitionArtifact);

  // Set the provider for our contract
  App.contracts.Permition.setProvider(App.web3Provider);

  // Use our contract to retrieve and mark the permited permit
  return App.markPermitted();
});
```

## Getting The Permition and Updating The UI
```js
var permitionInstance;

App.contracts.Permition.deployed().then(function(instance) {
  permitionInstance = instance;

  return permitionInstance.getPermitOwners.call();
}).then(function(permitOwners) {
  for (i = 0; i < permitOwners.length; i++) {
    if (permitOwners[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-permit').eq(i).find('button').text('Success').attr('disabled', true);
    }
  }
}).catch(function(err) {
  console.log(err.message);
});
```
## Handling the permit() Function

```js

var permitionInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  App.contracts.Permition.deployed().then(function(instance) {
    permitionInstance = instance;

    // Execute permit as a transaction by sending account
    return permitionInstance.permit(permitId, {from: account});
  }).then(function(result) {
    return App.markPermited();
  }).catch(function(err) {
    console.log(err.message);
  });
});

```
## Installing and configuring MetaMask

- first connect to GANACHE
  - HTTP://127.0.0.1:8545
  - 1337
  - ETH

- import account from GANACHE
  - 7155e315f57676c6d33bc6a8595d30f1c01671f229ae5613c3fb597a61f1ca43
  - 0x1d66880b4A21B6932D7b30a5d2D5A130A975c02E
  - GANACHE01


# Interacting with the dapp in a browser

# Issues

- contract has not been deployed to detected network (network/artifact mismatch) on Rinkeby Network
  - truffle migrate --reset
  - Metamask Connect to GANACHE02 (0xe9e...b788)


## Installing and configuring lite-server

Start the local web server:

> npm run dev

- Permit Permit
  - Breed: Boxer
  - Age: 3
  - Location: Matheny, Utah
  - by first-permited
    - Estimated gas fee
    - 0.00127442
    - 0.001274ETH
    - Max fee:
    - 0.00127442ETH
    - Total
    - 0.00127442
    - 0.00127442ETH
    - Amount + gas fee
  - Max amount: 0.00127442ETH


Breed: French Bulldog
Age: 2
Location: Gerber, South Dakota

- EDIT
- Estimated gas fee
- 0.00127442
- 0.001274ETH
- Max fee:
- 0.00127442ETH
- Total
- 0.00127442
- 0.00127442ETH
- Amount + gas fee
- Max amount: 0.00127442ETH

