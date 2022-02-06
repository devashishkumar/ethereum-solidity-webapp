const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require("web3");
const compiledBuild = require('../ethereum/build/campaign.sol.json');
// const compiledBuild = require('../ethereum/compile/campaign');

// const web = new Web3(ganache.provider());
const web = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

let accounts;
let factory;
let campaignAddress;
let campaign;
const parseBuild = JSON.parse(JSON.stringify(compiledBuild));
beforeEach( async () => {
    accounts = await web.eth.getAccounts();

    factory = await new web.eth.Contract(parseBuild['CampaignFactory'].abi)
    .deploy({ data: parseBuild['CampaignFactory'].evm.bytecode.object })
    .send({ from: accounts[0], gas: "20000" });

    await factory.methods.createCampaign('110').send({
        from: accounts[0],
        gas: 50000
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await web.eth.Contract(parseBuild['CampaignFactory'].abi, campaignAddress);
});

describe('Campaign Factory', () => {
    it('deploy contract', () => {
        assert.ok(factory.options.address);
    });
});