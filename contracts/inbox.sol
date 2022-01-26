// SPDX-License-Identifier: GPL-3.0

// pragma solidity >=0.7.0 <0.9.0;
pragma solidity ^0.8.11;

contract Inbox {

    string public message;

    // function Inbox(string msg) public {
    //     message = msg;
    // }

    function setMessage(string memory _msg) public {
        message = _msg;
    }
}