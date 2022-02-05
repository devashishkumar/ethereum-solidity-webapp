// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Campaign {
    
    address public manager;
    uint256 public minimumContribution;
    mapping(uint256 => Request) public requests;
    mapping(address => bool) approvers;
    uint256 public numRequests;
    struct Request {
        string description;
        address recipient;
        uint256 value;
        bool complete;
        uint approvalCount;
        mapping(address => bool) voters;
    }

    constructor(uint256 _minimum) {
        manager = msg.sender;
        minimumContribution = _minimum;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        // approvers.push(msg.sender);
        approvers[msg.sender] = true;
    }

    function request(
        string memory _description,
        uint256 _value,
        address _recipient
    ) public restricted {
        Request storage newRequest = requests[numRequests];
        numRequests++;
        newRequest.description = _description;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
        // requests.push(newRequest);
    }

    function approveRequest(uint _index) public {
        Request storage requestObj = requests[_index];

        require(approvers[msg.sender]);
        require(!requestObj.voters[msg.sender]);

        requestObj.voters[msg.sender] = true;
        requestObj.approvalCount++;

    }
}
