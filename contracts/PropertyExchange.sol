// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.21;

import "./PropertyLedger.sol";
import "./PropertyRegistry.sol";

contract PropertyExchange {

    PropertyLedger private propertiesContract;
    PropertyRegistry private LandRegistryContract;

    constructor(address _landRegistryContractAddress){
        LandRegistryContract = PropertyRegistry(_landRegistryContractAddress);
        
        address propertiesContractAddress = LandRegistryContract.getPropertiesContract();  

        propertiesContract = PropertyLedger(propertiesContractAddress);
        LandRegistryContract.setTransferOwnershipContractAddress(address(this));
    }    

    enum SaleState {
        Active, // on creation of sale by owner
        AcceptedBuyerRequest, // on accepting a buyer request
        Success // on successful payment and ownership transfer 
    }

    enum RequestedUserToASaleState {
        SentPurchaseRequest, // Buyer has sent purchase request to a seller
        CancelPurchaseRequest, //  Buyer wants to cancel purchase request sent. 

        SellerAcceptedPurchaseRequest, // Seller Accepted Purchase Request of a Buyer
        SellerRejectedPurchaseRequest, // Seller Rejected Purchase Request 

        SuccessfullyTransfered
    }

    struct RequestedUser {
        address user;
        uint256 priceOffered;
        RequestedUserToASaleState state;
        uint requestId; // request id from property contract
    }

    struct Sales {
        uint256 saleId;
        address owner;
        uint256 price;
        uint256 propertyId;
        address acceptedFor;
        uint256 acceptedPrice;
        uint256 acceptedTime;
        bool paymentDone;
        SaleState state;
        uint acceptedRequestId; // request id in Property contract that was accepted
        uint256 deadlineForPayment;
    }

    Sales[] private sales;

    mapping(address => uint256[]) private salesOfOwner;
    mapping(address => uint256[]) public requestedSales;
    mapping(uint256 => RequestedUser[]) requestedUsers;
    mapping(uint256 => uint256[]) private propertiesOnSaleByLocation;

    event PropertyOnSale(address indexed owner, uint256 indexed propertyId, uint256 saleId);
    event PurchaseRequestSent(uint256 saleId, address requestedUser, uint256 priceOffered);
    event SaleAccepted(uint256 saleId, address buyer, uint256 price, uint256 deadline);

    // Conversion function from Ether to Wei
    function convertToWei(uint256 etherValue) public pure returns (uint256) {
        return etherValue * 1 ether;
    }

    // Add Property on Sale
    function addPropertyOnSale( uint256 _propertyId, uint256 _price ) public {
        require(msg.sender == propertiesContract.getLandDetailsAsStruct(_propertyId).owner, "Only the owner can put the property on sale.");

        // add property id to list of properties that are available to sold on a loaction
        uint256 priceInWei = convertToWei(_price);

        Sales memory newSale = Sales({
            saleId: sales.length,
            owner: msg.sender,
            price: priceInWei,
            propertyId: _propertyId,
            acceptedFor: address(0),
            acceptedPrice: 0,
            acceptedTime: 0,
            paymentDone : false,
            state : SaleState.Active,
            acceptedRequestId: 0,
            deadlineForPayment: 0
        });

        sales.push(newSale);

        uint256[] storage propertiesOnSale = propertiesOnSaleByLocation[propertiesContract.getLandDetailsAsStruct(_propertyId).locationId];
        propertiesOnSale.push(sales.length - 1);

        salesOfOwner[msg.sender].push(newSale.saleId);

        propertiesContract.putOnSale(_propertyId, msg.sender, priceInWei, false);

        emit PropertyOnSale(msg.sender, _propertyId, newSale.saleId);
    }

    // function for getting all properties which are on sale of a owner
    function getMySales( address _owner ) public view returns (Sales[] memory) {
        uint256[] memory saleIds = salesOfOwner[_owner];
        Sales[] memory ownerSales = new Sales[](saleIds.length);

        for (uint256 i = 0; i < saleIds.length; i++) {
            ownerSales[i] = sales[saleIds[i]];
        }

        return ownerSales;
    }

    // Function to get all requested user details
    function getRequestedUsers( uint256 saleId ) public view returns (RequestedUser[] memory) {
        return requestedUsers[saleId];
    }

    // function to get all my requested sales to purchase of a buyer
    function getRequestedSales( address _owner ) public view returns (Sales[] memory) {
        uint256[] memory saleIds = requestedSales[_owner];
        Sales[] memory myRequestedSales = new Sales[](saleIds.length);

        for (uint256 i = 0; i < saleIds.length; i++) {
            myRequestedSales[i] = sales[saleIds[i]];
        }

        return myRequestedSales;
    }

    // function to return status of buyer request to purchase
    function getStatusOfPurchaseRequest( uint256 _saleId ) public view returns (RequestedUser memory) {
        bool buyerFound = false;
        uint i = 0;
        for (i = 0; i < requestedUsers[_saleId].length; i++) {
            if (requestedUsers[_saleId][i].user == msg.sender) {
                buyerFound = true;
                break;
            }
        }

        if(buyerFound == true){
            return requestedUsers[_saleId][i];
        } else {
            return RequestedUser({ user: address(0), priceOffered: 0, state: RequestedUserToASaleState.SentPurchaseRequest, requestId: 0 });
        }
    }

    // return all sales in that location
    function getSalesByLocation( uint256 locationId ) public view returns (Sales[] memory) {
        uint256[] memory saleIds = propertiesOnSaleByLocation[locationId];
            
        Sales[] memory salesGoingOnThisLocation = new Sales[](saleIds.length);

        for (uint256 i = 0; i < saleIds.length; i++) {
            salesGoingOnThisLocation[i] = sales[saleIds[i]];
        }

        return salesGoingOnThisLocation;
    }

    // send purchase request to seller to buy a land from buyer
    function sendPurchaseRequest(uint256 _saleId, uint256 _priceOffered) public {
        Sales storage sale = sales[_saleId];
        
        require(sale.propertyId != 0, "Sale does not exist");
        require(sale.state == SaleState.Active, "Property Not in Active State to Purchase"); 

        // convert price offered to wei
        uint256 priceWei = convertToWei(_priceOffered);

        uint requestId = propertiesContract.requestToBuy(sale.propertyId, msg.sender, priceWei);

        requestedUsers[sale.saleId].push(RequestedUser({
            user: msg.sender,
            priceOffered: priceWei,
            state: RequestedUserToASaleState.SentPurchaseRequest,
            requestId: requestId
        }));
        
        requestedSales[msg.sender].push(sale.saleId);

        emit PurchaseRequestSent(_saleId, msg.sender, priceWei);
    }


    // function to accept buyer request 
    function acceptBuyerRequest( uint256 _saleId, address _buyer, uint256 _price ) public {
        uint256 priceWei = convertToWei(_price);

        Sales storage sale = sales[_saleId];

        require(sale.propertyId != 0, "Sale does not exist");
        require(sale.state == SaleState.Active, "Sale is not active");
        require(msg.sender == propertiesContract.getLandDetailsAsStruct(sale.propertyId).owner, "Only the owner can accept the purchase request.");

        bool buyerFound = false;
        uint idx = 0;
        for (uint i = 0; i < requestedUsers[sale.saleId].length; i++) {
            if (requestedUsers[sale.saleId][i].user == _buyer) {
                buyerFound = true;
                idx = i;
                break;
            }
        }

        require(buyerFound, "Buyer not found in requested user array");
        require(priceWei == requestedUsers[sale.saleId][idx].priceOffered, "Price mismatch with buyer's offer");

        uint requestId = requestedUsers[sale.saleId][idx].requestId;
        require(requestId != 0, "Invalid request id");

        propertiesContract.approveSale(sale.propertyId, requestId, msg.sender);

        sale.acceptedFor = _buyer;
        sale.acceptedPrice = priceWei;
        sale.acceptedTime = block.timestamp;
        sale.deadlineForPayment = block.timestamp + 5 minutes;
        sale.state = SaleState.AcceptedBuyerRequest;
        sale.acceptedRequestId = requestId;

        requestedUsers[sale.saleId][idx].state = RequestedUserToASaleState.SellerAcceptedPurchaseRequest;

        emit SaleAccepted(_saleId, _buyer, priceWei, sale.deadlineForPayment);
    }

    // function to cancel sale created by seller
    function cancelSaleBySeller(uint256 _saleId) public returns (bool) {
        Sales storage sale = sales[_saleId];
        
        require(sale.owner == msg.sender, "Only property owner can cancel sale");
        require(!sale.paymentDone, "Payment has already been made");
        require(sale.state != SaleState.Success, "Succeeded sale can't be canceled.");
        require(sale.state != SaleState.AcceptedBuyerRequest, "Sale accepted to buyer; cancel acceptance first");

        sale.state = SaleState.Active; 
        sale.acceptedFor = address(0);
        sale.acceptedPrice = 0;
        sale.acceptedTime = 0;
        sale.deadlineForPayment = 0;
        sale.paymentDone = false;
        sale.acceptedRequestId = 0;

        propertiesContract.putOnSale(sale.propertyId, msg.sender, 0, true);

        return true;
    }

    // Buyer completes payment and triggers ownership transfer
    function transferOwnerShip( uint256 saleId ) public payable {
        Sales storage sale = sales[saleId];
        
        require(sale.acceptedFor != address(0), "No buyer accepted");
        require(msg.sender == sale.acceptedFor, "Only accepted buyer can complete the sale");
        require(msg.value == sale.acceptedPrice, "Payment amount must be equal to accepted price");
        require(block.timestamp <= sale.deadlineForPayment, "Payment deadline has passed");
        
        bool buyerFound = false;
        uint idx = 0;
        for (uint i = 0; i < requestedUsers[sale.saleId].length; i++) {
            if (requestedUsers[sale.saleId][i].user == msg.sender) {
                buyerFound = true;
                idx = i;
                break;
            }
        }
        require(buyerFound, "Buyer not found in requested list");
        
        payable(sale.owner).transfer(msg.value);

        LandRegistryContract.transferOwnership(sale.propertyId, sale.acceptedRequestId, sale.acceptedFor);

        requestedUsers[sale.saleId][idx].state = RequestedUserToASaleState.SuccessfullyTransfered;

        uint256 _location = propertiesContract.getLandDetailsAsStruct(sale.propertyId).locationId;
        uint256[] storage propertiesOnSale = propertiesOnSaleByLocation[_location];
        for (uint i = 0; i < propertiesOnSale.length; i++) {
            if (propertiesOnSale[i] == sale.saleId) {
                propertiesOnSale[i] = propertiesOnSale[propertiesOnSale.length - 1];
                propertiesOnSale.pop();
                break;
            }
        }

        sale.state = SaleState.Success;
        sale.paymentDone = true;
    }
}