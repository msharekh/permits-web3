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
  "name": "pet-shop",
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
```truffle unbox pet-shop```

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

```address[16] public permits;```

## Your first function: Adopting a pet
```js
// Adopting a pet
function adopt(uint petId) public returns (uint) {
  require(petId >= 0 && petId <= 15);

  adopters[petId] = msg.sender;

  return petId;
}
```

## Your second function: Retrieving the adopters¶

```js
// Retrieving the adopters
function getAdopters() public view returns (address[16] memory) {
  return adopters;
}
```

# Compiling and migrating the smart contract

## Compilation

```truffle compile```

```
msh@Meshals-MacBook-Pro pet-shop-tutorial % truffle compile

Compiling your contracts...
===========================
> Compiling ./contracts/Adoption.sol
> Compiling ./contracts/Migrations.sol
> Artifacts written to /Users/msh/development/pet-shop-tutorial/build/contracts
```

## Migration

Now we are ready to create our own migration script.

- Create a new file named `2_deploy_contracts.js` in the migrations/ directory.

- Add the following content to the 2_deploy_contracts.js file:


```js
var Adoption = artifacts.require("Adoption");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
};
```
```truffle migrate```

# Testing the smart contract
## Testing the smart contract using JavaScript¶

Create a new file named `testAdoption.test.js` in the `test/` directory.


```js
const Adoption = artifacts.require("Adoption");

contract("Adoption", (accounts) => {
  let adoption;
  let expectedAdopter;

  before(async () => {
      adoption = await Adoption.deployed();
  });

  describe("adopting a pet and retrieving account addresses", async () => {
    before("adopt a pet using accounts[0]", async () => {
      await adoption.adopt(8, { from: accounts[0] });
      expectedAdopter = accounts[0];
    });
  });
});

```

`truffle test`

```
Using network 'development'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


  Contract: Adoption
    adopting a pet and retrieving account addresses
      ✓ can fetch the address of an owner by pet id (62ms)


  1 passing (396ms)
```

# Creating a user interface to interact with the smart contract

Included with the pet-shop Truffle Box was code for the app's front-end. That code exists within the `src/` directory.

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
$.getJSON('Adoption.json', function(data) {
  // Get the necessary contract artifact file and instantiate it with @truffle/contract
  var AdoptionArtifact = data;
  App.contracts.Adoption = TruffleContract(AdoptionArtifact);

  // Set the provider for our contract
  App.contracts.Adoption.setProvider(App.web3Provider);

  // Use our contract to retrieve and mark the adopted pets
  return App.markAdopted();
});
```

## Getting The Adopted Pets and Updating The UI
```js
var adoptionInstance;

App.contracts.Adoption.deployed().then(function(instance) {
  adoptionInstance = instance;

  return adoptionInstance.getAdopters.call();
}).then(function(adopters) {
  for (i = 0; i < adopters.length; i++) {
    if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
    }
  }
}).catch(function(err) {
  console.log(err.message);
});
```
## Handling the adopt() Function

```js

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




## Installing and configuring lite-server

Start the local web server:

> npm run dev

- Adopt pet
  - Breed: Boxer
  - Age: 3
  - Location: Matheny, Utah
  - by first-adoptor
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

