const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');
const currentDirectory = __dirname;
const projectDirectory = process.cwd();

const buildPath = path.resolve(`${projectDirectory}/ethereum`, 'build');
// fs.removeSync(buildPath, 'utf8');

const inboxPath = path.resolve(`${projectDirectory}/ethereum`, 'contracts', 'inbox.sol');
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

fs.ensureDirSync(buildPath);

const abi = output.contracts["inbox.sol"]["Inbox"].abi;
const byteCode = output.contracts["inbox.sol"]["Inbox"].evm.bytecode.object;

module.exports = {
    interface: abi,
    byteCode: byteCode
};

const outputObj = JSON.parse(JSON.stringify(output.contracts));
for (let contract in outputObj) {
    if (Object.keys(output.contracts[contract]) && Object.keys(output.contracts[contract]).length) {
        Object.keys(output.contracts[contract]).forEach(e => {
            fs.outputJSONSync(
                path.resolve(buildPath, e + '.json'), output.contracts[contract][e]
            );
        });
    } else {
        fs.outputJSONSync(
            path.resolve(buildPath, contract + '.json'), output.contracts[contract]
        );
    }
}