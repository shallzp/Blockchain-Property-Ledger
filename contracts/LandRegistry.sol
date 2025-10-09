// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.21;

import "./Properties.sol";

contract LandRegistry {
    
    address private contractOwner;
    address private transferOwnershipContractAddress;
    bool private transferOwnershipContractAddressUpdated = false;

    Property public propertiesContract;

    constructor() {
        contractOwner = msg.sender;
        transferOwnershipContractAddress = address(0);
        transferOwnershipContractAddressUpdated = false;
        propertiesContract = new Property();
    }

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Caller is not the owner");
        _;
    }

    modifier onlyRevenueDeptEmployee(uint256 revenueDeptId) {
        require(msg.sender == revenueDeptIdToEmployee[revenueDeptId], "Only the revenue department employee can call this function.");
        _;
    }

    event LandAdded(address indexed owner,uint256 indexed propertyId);

    mapping(address => uint256[]) private propertiesOfOwner;
    mapping(uint256 => uint256[]) private propertiesControlledByRevenueDept;
    mapping (uint256 => address) public revenueDeptIdToEmployee;

    // Set the address of the TransferOfOwnership contract (only once)
    function setTransferOwnershipContractAddress( address contractAddress ) public {
        require(transferOwnershipContractAddressUpdated==false,"Allowed Only Once to call");
        
        transferOwnershipContractAddress = contractAddress;
        transferOwnershipContractAddressUpdated = true;
    }

    // Add New Land
    function addLand(uint256 _locationId, uint256 _revenueDepartmentId, uint256 _surveyNumber, uint256 _area) public returns (uint256) {
        address _owner = msg.sender;
        uint256 propertyId = propertiesContract.addLand(_locationId, _surveyNumber, _revenueDepartmentId, _owner, _area);

        propertiesOfOwner[_owner].push(propertyId); // Map property to owner
        propertiesControlledByRevenueDept[_revenueDepartmentId].push(propertyId); // Map property to revenue department

        emit LandAdded(_owner, propertyId);

        return propertyId;
    }

    // Get property details by property ID
    function getPropertyDetails( uint256 _propertyId ) public view returns ( Property.Land memory ) {
        return propertiesContract.getLandDetailsAsStruct(_propertyId);
    }

    // Get all properties of an owner
    function getPropertiesOfOwner( address _owner ) public view returns ( Property.Land[] memory ) {
        uint256[] memory propertyIds = propertiesOfOwner[_owner];
        Property.Land[] memory properties = new Property.Land[](propertyIds.length);
        
        for (uint256 i = 0; i < propertyIds.length; i++) {
            properties[i] = propertiesContract.getLandDetailsAsStruct(propertyIds[i]);
        }

        return properties;
    }

    // Get properties by revenue department
    function getPropertiesByRevenueDeptId( uint256 _revenueDeptId ) public view returns ( Property.Land[] memory ) {
        uint256[] memory propertyIds = propertiesControlledByRevenueDept[_revenueDeptId];
        
        Property.Land[] memory properties = new Property.Land[](propertyIds.length);
        
        for (uint256 i = 0; i < propertyIds.length; i++) {
            properties[i] = propertiesContract.getLandDetailsAsStruct(propertyIds[i]);
        }
          
        return properties;
    }
            
    // Map revenue department id to employee
    function mapRevenueDeptIdToEmployee( uint256 revenueDeptId, address employeeAddress ) public onlyOwner {
        revenueDeptIdToEmployee[revenueDeptId] = employeeAddress;
    }

    // Get revenue dept id of a property
    function getRevenueDeptId(uint256 propertyId) private view returns (uint256) {
        return propertiesContract.getLandDetailsAsStruct(propertyId).revenueDepartmentId;
    }

    function verifyProperty( uint256 _propertyId ) public onlyRevenueDeptEmployee(getRevenueDeptId(_propertyId)) {
        propertiesContract.markVerified(_propertyId, msg.sender);
    }

    function rejectProperty( uint256 _propertyId ) public onlyRevenueDeptEmployee(getRevenueDeptId(_propertyId)) {
        propertiesContract.putOnSale(_propertyId, msg.sender, 0, true);
    }

    function transferOwnership (uint256 _propertyId, uint requestId, address newOwner) public {
        require(msg.sender == transferOwnershipContractAddress, "Only TransferOfOwnership contract allowed");

        // Remove property from old owner's list
        address oldOwner = propertiesContract.getLandDetailsAsStruct(_propertyId).owner;
        uint256[] storage oldOwnerProps = propertiesOfOwner[oldOwner];
        for (uint i = 0; i < oldOwnerProps.length; i++) {
            if (oldOwnerProps[i] == _propertyId) {
                oldOwnerProps[i] = oldOwnerProps[oldOwnerProps.length - 1];
                oldOwnerProps.pop();
                break;
            }
        }

        // Add property to new owner's list
        propertiesOfOwner[newOwner].push(_propertyId);

        // Update ownership in Property contract
        propertiesContract.transferOwnership(_propertyId, requestId, newOwner);
    }

    function getPropertiesContract() public view returns (address){
        return address(propertiesContract);
    }
}