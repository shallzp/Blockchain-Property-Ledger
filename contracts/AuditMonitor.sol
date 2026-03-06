// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.21;

contract AuditMonitor {
    address public owner;

    event UserRegistered(address indexed userID, uint256 timestamp);
    event UserVerified(address indexed userID, uint256 timestamp);
    event RegionalAdminAdded(address indexed userID, uint256 timestamp);
    event RegionalAdminRemoved(address indexed userID, uint256 timestamp);
    event PropertyAdded(uint256 indexed propertyId, address indexed owner, uint256 timestamp);
    event PropertyVerified(uint256 indexed propertyId, uint256 timestamp);
    event OwnershipTransferred(uint256 indexed propertyId, address indexed oldOwner, address indexed newOwner, uint256 timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function logUserRegistered(address userID) external onlyOwner {
        emit UserRegistered(userID, block.timestamp);
    }

    function logUserVerified(address userID) external onlyOwner {
        emit UserVerified(userID, block.timestamp);
    }

    function logRegionalAdminAdded(address userID) external onlyOwner {
        emit RegionalAdminAdded(userID, block.timestamp);
    }
    
    function logRegionalAdminRemoved(address userID) external onlyOwner {
        emit RegionalAdminRemoved(userID, block.timestamp);
    }

    function logPropertyAdded(uint256 propertyId, address ownerAddr) external onlyOwner {
        emit PropertyAdded(propertyId, ownerAddr, block.timestamp);
    }

    function logPropertyVerified(uint256 propertyId) external onlyOwner {
        emit PropertyVerified(propertyId, block.timestamp);
    }

    function logOwnershipTransferred(uint256 propertyId, address oldOwner, address newOwner) external onlyOwner {
        emit OwnershipTransferred(propertyId, oldOwner, newOwner, block.timestamp);
    }
}