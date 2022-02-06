const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require("web3");
const compiledCampaign = require('../ethereum/build/Campaign.json');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
// const compiledBuild = require('../ethereum/compile/campaign');

// const web = new Web3(ganache.provider());
const web = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

let accounts;
let factory;
let campaignAddress;
let campaign;
const compiledCode = JSON.parse(JSON.stringify(compiledFactory));

/**
 * deploy contract using compile script
 */
 async function deployContractFromConpiledScript() {
    return await new web.eth.Contract(compiledCode.interface)
        .deploy({ data: compiledCode.byteCode })
        .send({ from: accounts[0], gas: 1000000 })
}

/**
 * deploy contract from contract builds
 */
async function deployContractFromBuildPath() {
    return await new web.eth.Contract(compiledCode.abi)
    .deploy({ data: compiledCode.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1000000" });
}

beforeEach(async () => {
    accounts = await web.eth.getAccounts();

    factory = await new web.eth.Contract(compiledCode.abi)
    .deploy({ data: compiledCode.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1000000" });

    await factory.methods.createCampaign('110').send({
        from: accounts[0],
        gas: 50000
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await web.eth.Contract(parseBuild.abi, campaignAddress);
});

describe('Campaign Factory', () => {
    it('deploy contract', () => {
        assert.ok(factory.options.address);
    });
});