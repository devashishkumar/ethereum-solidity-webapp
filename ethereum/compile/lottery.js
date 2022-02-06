const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');
const currentDirectory = __dirname;
const projectDirectory = process.cwd();

const buildPath = path.resolve(`${projectDirectory}/ethereum`, 'build');
// fs.removeSync(buildPath, 'utf8');

const lotteryPath = path.resolve(`${projectDirectory}/ethereum`, 'contracts', 'lottery.sol');
const fileContent = fs.readFileSync(lotteryPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'lottery.sol': {
            content: fileContent
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDirSync(buildPath);

const abi = output.contracts["lottery.sol"]["Lottery"].abi;
const byteCode = output.contracts["lottery.sol"]["Lottery"].evm.bytecode.object;
// const content = output.contracts["lottery.sol"]['Lottery'];
module.exports = {
    interface: abi,
    byteCode: byteCode
};

const outputObj = JSON.parse(JSON.stringify(output.contracts));
for (let contract in outputObj) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract + '.json'), output.contracts[contract]
    );
}