const path = require('path');
const fs = require('fs');
const solc = require('solc');
const currentDirectory = __dirname;
const projectDirectory = process.cwd();
const inboxPath = path.resolve(projectDirectory, 'contracts', 'lottery.sol');
const fileContent = fs.readFileSync(inboxPath, 'utf8');

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
const abi = output.contracts["lottery.sol"]["Lottery"].abi;
const byteCode = output.contracts["lottery.sol"]["Lottery"].evm.bytecode.object;
// const content = output.contracts["lottery.sol"]['Lottery'];
module.exports = {
    interface: abi,
    byteCode: byteCode
};