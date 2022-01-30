import { Component, OnInit } from '@angular/core';
declare var Web3: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lottery-frontend';
  serverInst = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
  // serverInst = new Web3(window['web3'].currentProvider);
  blockchainAccounts: any = [];
  address = '0x51A54343D704E6e8AD072C14C52A7ADE4cb34937';
  abi: any = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor", "signature": "constructor" }, { "inputs": [], "name": "enter", "outputs": [], "stateMutability": "payable", "type": "function", "payable": true, "signature": "0xe97dcb62" }, { "inputs": [], "name": "getPlayers", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x8b5b9ccc" }, { "inputs": [], "name": "manager", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0x481c6a75" }, { "inputs": [], "name": "pickWinner", "outputs": [], "stateMutability": "nonpayable", "type": "function", "signature": "0x5d495aea" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "players", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true, "signature": "0xf71d96cb" }];
  lotteryContract: any;
  manager = '';

  ngOnInit(): void {
    this.getAccounts();
  }

  /**
   * get blockchain connected accounts
   */
  getAccounts() {
    this.serverInst.eth.getAccounts().then((response: any) => {
      console.log(response);
      if (response && response.length) {
        this.blockchainAccounts = response;
        this.getContract();
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  /**
   * contract instance
   */
  getContract() {
    this.lotteryContract = new this.serverInst.eth.Contract(this.abi, this.address);
    this.getManager()
  }

  /**
   * active address
   */
  async getManager() {
    this.manager = await this.lotteryContract.methods.manager().call();
  }

}
