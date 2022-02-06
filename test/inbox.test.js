const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require("web3");
const compiledCode = require('../ethereum/compile/inbox');

// const web = new Web3(ganache.provider());
const web = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

const DEFAULT_MESSAGE = 'Hello';
const UPDATED_MESSATE = 'Updated Message';

let accounts;
let inbox;
beforeEach(async () => {
    accounts = await web.eth.getAccounts();
    inbox = await new web.eth.Contract(compiledCode.interface)
        .deploy({ data: compiledCode.byteCode, arguments: [DEFAULT_MESSAGE] })
        .send({ from: accounts[0], gas: 1000000 })
});

describe('Inbox Contract', () => {
    it('deploy contract', () => {
        assert.ok(inbox.options.address);
    });

    it('assign default message using smart contract constructor', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, DEFAULT_MESSAGE);
    });

    it('change message', async () => {
        await inbox.methods.setMessage(UPDATED_MESSATE).send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, UPDATED_MESSATE);
    });
});