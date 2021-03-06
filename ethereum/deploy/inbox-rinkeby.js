const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledCode = require('../compile/inbox');
const provider = new HDWalletProvider(
    'strategy trim athlete cook drip bread hamster beef west hammer own across',
    'https://rinkeby.infura.io/v3/rinkeybykey'
);

const web = new Web3(provider);

const DEFAULT_MESSAGE = 'Hello';
const UPDATED_MESSATE = 'Updated Message';

const deploy = async () => {
    const accounts = await web.eth.getAccounts();

    const result = await new web.eth.Contract(compiledCode.interface)
        .deploy({ data: compiledCode.byteCode, arguments: [DEFAULT_MESSAGE] })
        .send({ from: accounts[0], gas: '500000' })

    console.log("contract deployed ", result.options.address);
}

deploy();