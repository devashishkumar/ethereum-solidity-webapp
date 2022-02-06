const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');
const currentDirectory = __dirname;
const projectDirectory = process.cwd();

const buildPath = path.resolve(`${projectDirectory}/ethereum`, 'build');
// fs.removeSync(buildPath, 'utf8');

const campaignPath = path.resolve(`${projectDirectory}/ethereum`, 'contracts', 'campaign.sol');
const fileContent = fs.readFileSync(campaignPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'campaign.sol': {
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
console.log(output);

const abi = output.contracts["campaign.sol"]["Campaign"].abi;
const byteCode = output.contracts["campaign.sol"]["Campaign"].evm.bytecode.object;

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