const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledCode = require('./compile');
const provider = new HDWalletProvider(
    'keen swing flash again little laugh today grit pool memory pride column',
    'https://rinkeby.infura.io/key'
);

const web = new Web3(provider);