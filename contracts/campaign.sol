// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 _mimimum) public {
        address newCampaign = address(new Campaign(_mimimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    address public manager;
    uint256 public minimumContribution;
    mapping(uint256 => Request) public requests;
    mapping(address => bool) approvers;
    uint256 public numRequests;
    uint256 public approversCount = 0;
    struct Request {
        string description;
        address payable recipient;
        uint256 value;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) voters;
    }

    constructor(uint256 _minimum, address _sender) {
        manager = _sender;
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
        approversCount++;
    }

    function request(
        string memory _description,
        uint256 _value,
        address payable _recipient
    ) public restricted {
        Request storage newRequest = requests[numRequests];
        numRequests++;
        newRequest.description = _description;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 _index) public {
        Request storage requestObj = requests[_index];

        require(approvers[msg.sender]);
        require(!requestObj.voters[msg.sender]);

        requestObj.voters[msg.sender] = true;
        requestObj.approvalCount++;
    }

    function finalizeRequest(uint256 _index) public restricted {
        Request storage requestObj = requests[_index];
        require(requestObj.approvalCount > (approversCount / 2));
        require(!requestObj.complete);

        requestObj.recipient.transfer(requestObj.value);
        requestObj.complete = true;
    }
}
