const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require("web3");
// const compiledCode = require('../ethereum/compile/lottery');
const inputBuild = require('../ethereum/build/lottery.sol.json');

// const web = new Web3(ganache.provider());
const web = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

const DEFAULT_MESSAGE = 'Hello';
const UPDATED_MESSATE = 'Updated Message';

let accounts;
let lottery;
const compiledCode = JSON.parse(JSON.stringify(inputBuild));

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
    return await new web.eth.Contract(compiledCode['Lottery'].abi)
        .deploy({ data: compiledCode['Lottery'].evm.bytecode.object })
        .send({ from: accounts[0], gas: 1000000 })
}

beforeEach(async () => {
    accounts = await web.eth.getAccounts();
    lottery = await new web.eth.Contract(compiledCode['Lottery'].abi)
        .deploy({ data: compiledCode['Lottery'].evm.bytecode.object })
        .send({ from: accounts[0], gas: 1000000 })
});

describe('Lottery Contract', () => {
    it('deploy contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allow multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[3],
            value: web.utils.toWei('0.02', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(accounts[3], players[3]);
        assert.equal(4, players.length)
    });

    it('allow minimum amount to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false);
        } catch (err) {
            assert.ok(err);
        }
    });

    it('only manager call call pickWinner method', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1],
            });
            assert(false);
        } catch (err) {
            assert.ok(err);
        }
    });

    it('send money to the winner', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web.utils.toWei('2', 'ether')
        });

        const initialBalance = await web.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({ from: accounts[0] });

        const finalBalance = await web.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;
        console.log(difference);

        assert(difference > web.utils.toWei('1.8', 'ether'));
    });
});