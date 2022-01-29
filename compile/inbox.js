const path = require('path');
const fs = require('fs');
const solc = require('solc');
const currentDirectory = __dirname;
const projectDirectory = process.cwd();
const inboxPath = path.resolve(projectDirectory, 'contracts', 'inbox.sol');
const fileContent = fs.readFileSync(inboxPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'inbox.sol': {
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
const abi = output.contracts["inbox.sol"]["Inbox"].abi;
const byteCode = output.contracts["inbox.sol"]["Inbox"].evm.bytecode.object;
// const content = output.contracts["inbox.sol"]['Inbox'];
module.exports = {
    interface: abi,
    byteCode: byteCode
};