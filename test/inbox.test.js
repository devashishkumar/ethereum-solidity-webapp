const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require("web3");
const compiledCode = require('../compile');

const web = new Web3(ganache.provider());

let accounts;
let inbox;
beforeEach(async () => {
    accounts = await web.eth.getAccounts();
    // console.log(compiledCode.interface, compiledCode.byteCode);
    inbox = await new web.eth.Contract(compiledCode.interface)
    .deploy({data: compiledCode.byteCode, arguments: ['Hello']})
    .send({from: accounts[0], gas: '1000000'})
});

describe('Inbox', () => {
    it('deploy contract', () => {
        console.log(inbox, '18');
    });
});