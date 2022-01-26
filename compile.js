const path = require('path');
const fs = require('fs');
const solc = require('solc');
const inboxPath = path.resolve(__dirname, 'contracts', 'inbox.sol');
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
// const abi = output.contracts["inbox.sol"]["Inbox"].abi;
// const byteCode = output.contracts["inbox.sol"]["Inbox"].evm.bytecode.object;
// module.exports = abi;
// module.exports = byteCode;
const content = output.contracts["inbox.sol"]['Inbox'];
module.exports = {
    interface: abi,
    byteCode: byteCode
};