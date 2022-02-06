const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require("web3");
const compiledBuild = require('../ethereum/build/campaign.sol.json');

// const web = new Web3(ganache.provider());
const web = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

let accounts;
let factory;
let campaignAddress;
let campaign;
const parseBuild = JSON.parse(JSON.stringify(compiledBuild));
beforeEach(async () => {
    accounts = await web.eth.getAccounts();
    factory = await new web.eth.Contract(parseBuild['CampaignFactory'].abi)
    .deploy({ data: parseBuild['CampaignFactory'].evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' })
});

describe('Campaign Factory', () => {
    it('deploy contract', () => {
        console.log(inbox.options.address);
        assert.ok(inbox.options.address);
    });
});