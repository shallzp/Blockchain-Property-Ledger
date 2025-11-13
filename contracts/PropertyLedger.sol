// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.21;

contract PropertyLedger {
    
    enum StateOfProperty { 
        Registered, //Property added by Regional Admin; not yet verified on-chain.
        Verified, //Admin approved property; NFT can be minted or metadata recorded.
        OnSale, //Owner has marked property “For Sale.”
        SaleRequested, //Buyer sent purchase request; waiting for owner approval. 
        SaleApproved, //Owner accepted the buyer; waiting for admin confirmation or payment.   
        PendingTransfer //Ownership transfer is being processed on-chain.   
    }
    
    struct Land {
        uint256 propertyId; //unique identifier
        address owner; //owner address
        address admin; //address of admin who verified
        uint256 revenueDepartmentId;
        uint256 locationId;
        uint256 surveyNumber;
        uint index; //owners property index
        uint256 area;
        uint256 marketValue;
        uint noOfRequests;
        StateOfProperty state;
    }

    struct RequestDetails {
        address buyer;
        uint256 offerPrice;
        bool approvedByOwner; // Whether owner approved
        bool approvedByAdmin; // Whether admin approved (if needed)
        StateOfProperty requestState; // SaleRequested, SaleApproved, etc.
    }

    mapping(uint256 => Land) public lands;
    mapping(uint256 => mapping(uint => RequestDetails)) public landRequests; //propID -> //purchase requests (request number → RequestDetails)
    uint256 private landCount;
    
    function addLand( 
        uint256 _locationId, 
        uint256 _surveyNumber,
        uint256 _revenueDepartmentId, 
        address _owner, 
        uint256 _area 
    ) public returns (uint256) {
        landCount++;

        Land storage newLand = lands[landCount];

        newLand.propertyId = landCount;
        newLand.revenueDepartmentId = _revenueDepartmentId;
        newLand.locationId = _locationId;
        newLand.surveyNumber = _surveyNumber;
        newLand.owner = _owner;
        newLand.area = _area;
        newLand.state = StateOfProperty.Registered;
        newLand.noOfRequests = 0;

        return landCount; // Return the new property's ID
    }

    // Get Property Details
    function getLandDetailsAsStruct(uint256 _propertyId) public view returns (Land memory) {
        return lands[_propertyId];
    }
    
    function updateLand(
        uint256 _propertyId,
        uint256 _revenueDepartmentId,
        uint256 _locationId,
        uint256 _surveyNumber,
        address _owner,
        uint256 _area,
        address _admin,
        uint256 _marketValue,
        StateOfProperty _state
    ) public {
        require(lands[_propertyId].propertyId != 0, "Land does not exist");

        Land storage land = lands[_propertyId];

        land.revenueDepartmentId = _revenueDepartmentId;
        land.locationId = _locationId;
        land.surveyNumber = _surveyNumber;
        land.owner = _owner;
        land.area = _area;
        land.admin = _admin;
        land.marketValue = _marketValue;
        land.state = _state;
    }

    // Mark Verified by admin
    // changeStateToVerified 
    function markVerified(uint256 _propertyId, address _admin) public { 
        require(lands[_propertyId].propertyId != 0, "Land does not exist");

        lands[_propertyId].admin = _admin;
        lands[_propertyId].state = StateOfProperty.Verified;
    }

    // Put on Sale
    // changeStateToOnSale
    function putOnSale(uint256 _propertyId, address _owner, uint256 _price, bool _cancel) public {
        require(lands[_propertyId].propertyId != 0, "Land does not exist");
        require(lands[_propertyId].owner == _owner, "Only owner can modify sale status");

        if (_cancel) {
            // Cancel sale: revert state to Verified
            lands[_propertyId].state = StateOfProperty.Verified;
            lands[_propertyId].marketValue = 0;
        } else {
            // Put property on sale
            lands[_propertyId].marketValue = _price;
            lands[_propertyId].state = StateOfProperty.OnSale;
        }
    }

    // Cancel sale by owner and revert to Verified state
    function cancelSale(uint256 _propertyId, address _owner) public {
        require(lands[_propertyId].propertyId != 0, "Land does not exist");
        require(lands[_propertyId].owner == _owner, "Only owner can cancel sale");
        require(lands[_propertyId].state == StateOfProperty.OnSale, "Property is not currently on sale");

        lands[_propertyId].state = StateOfProperty.Verified;
        lands[_propertyId].marketValue = 0;  // Reset market value to zero
    }



    // Request to Buy
    function requestToBuy(uint256 _propertyId, address _buyer, uint256 _offerPrice) public returns (uint256) {
        Land storage land = lands[_propertyId];
        
        require(land.propertyId != 0, "Land does not exist");
        require(land.state == StateOfProperty.OnSale, "Property not for sale");

        land.noOfRequests++;
        landRequests[_propertyId][land.noOfRequests] = RequestDetails({
            buyer: _buyer,
            offerPrice: _offerPrice,
            approvedByOwner: false,
            approvedByAdmin: false,
            requestState: StateOfProperty.SaleRequested
        });

        return land.noOfRequests;
    }

    // Approve Sale by Owner
    function approveSale(uint256 _propertyId, uint requestId, address _owner) public {
        Land storage land = lands[_propertyId];
        
        require(land.propertyId != 0, "Land does not exist");
        require(land.owner == _owner, "Only owner can approve");
        require(requestId <= land.noOfRequests, "Invalid request");

        landRequests[_propertyId][requestId].approvedByOwner = true;
        landRequests[_propertyId][requestId].requestState = StateOfProperty.SaleApproved;
        land.state = StateOfProperty.SaleApproved;
    }

    // Transfer Ownership
    function transferOwnership(uint256 _propertyId, uint requestId, address _newOwner) public {
        Land storage land = lands[_propertyId];
        
        require(land.propertyId != 0, "Land does not exist");
        require(requestId > 0 && requestId <= land.noOfRequests, "Invalid request");

        RequestDetails storage request = landRequests[_propertyId][requestId];
        require(request.approvedByOwner, "Owner has not approved the request");
        require(request.requestState == StateOfProperty.SaleApproved || request.requestState == StateOfProperty.PendingTransfer, 
            "Request not ready for transfer");

        // Transfer ownership
        land.owner = _newOwner;
        land.state = StateOfProperty.Verified; // Reset state to Verified after transfer
        request.requestState = StateOfProperty.Verified;

        // Reset market value after sale
        land.marketValue = 0;
    }
}