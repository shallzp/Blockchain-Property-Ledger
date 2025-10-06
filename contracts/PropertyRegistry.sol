pragma solidity ^0.8.21 ;

/**
 * @title PropertyRegistry
 * @dev Smart contract for Ethereum-based property registration system
 * @notice This contract manages property registration, ownership transfers, and maintains complete history
 */
 
contract PropertyRegistry {
    
    // ============ State Variables ============
    
    address public registrar;
    uint256 public totalProperties;
    
    // ============ Structs ============
    
    struct Property {
        string propertyID;
        address currentOwner;
        address previousOwner;
        string documentHash; // IPFS hash
        string transactionType; // e.g. "SaleDeed", "Mortgage", "Gift", "Inheritance"
        uint256 timestamp;
        bool exists;
    }
    
    struct OwnershipHistory {
        address owner;
        string transactionType;
        uint256 timestamp;
        string documentHash;
    }
    
    // ============ Mappings ============
    
    // PropertyID to Property details
    mapping(string => Property) public properties;
    
    // PropertyID to ownership history (array of all past owners)
    mapping(string => OwnershipHistory[]) public ownershipHistory;
    
    // PropertyID to digital signatures
    mapping(string => string[]) public digitalSignatures;
    
    // Address to list of property IDs owned
    mapping(address => string[]) public ownerToProperties;
    
    // Track if a propertyID exists
    mapping(string => bool) public propertyExists;
    
    // ============ Events ============
    
    event PropertyRegistered(
        string indexed propertyID,
        address indexed owner,
        string documentHash,
        string transactionType,
        uint256 timestamp
    );
    
    event OwnershipTransferred(
        string indexed propertyID,
        address indexed previousOwner,
        address indexed newOwner,
        string transactionType,
        string documentHash,
        uint256 timestamp
    );
    
    event SignatureAdded(
        string indexed propertyID,
        string signature,
        uint256 timestamp
    );
    
    event RegistrarChanged(
        address indexed oldRegistrar,
        address indexed newRegistrar,
        uint256 timestamp
    );
    
    // ============ Modifiers ============
    
    modifier onlyRegistrar() {
        require(msg.sender == registrar, "Only registrar can perform this action");
        _;
    }
    
    modifier onlyPropertyOwner(string memory _propertyID) {
        require(
            properties[_propertyID].currentOwner == msg.sender,
            "Only current owner can perform this action"
        );
        _;
    }
    
    modifier propertyMustExist(string memory _propertyID) {
        require(propertyExists[_propertyID], "Property does not exist");
        _;
    }
    
    modifier propertyMustNotExist(string memory _propertyID) {
        require(!propertyExists[_propertyID], "Property already exists");
        _;
    }
    
    // ============ Constructor ============
    
    constructor() {
        registrar = msg.sender;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Register a new property
     * @param _propertyID Unique identifier for the property
     * @param _owner Initial owner of the property
     * @param _documentHash IPFS hash of the property document
     * @param _transactionType Type of transaction (e.g., "SaleDeed", "Mortgage")
     */
     
    function registerProperty(
        string memory _propertyID,
        address _owner,
        string memory _documentHash,
        string memory _transactionType
    ) public onlyRegistrar propertyMustNotExist(_propertyID) {
        require(_owner != address(0), "Invalid owner address");
        require(bytes(_propertyID).length > 0, "Property ID cannot be empty");
        require(bytes(_documentHash).length > 0, "Document hash cannot be empty");
        
        // Create new property
        properties[_propertyID] = Property({
            propertyID: _propertyID,
            currentOwner: _owner,
            previousOwner: address(0),
            documentHash: _documentHash,
            transactionType: _transactionType,
            timestamp: block.timestamp,
            exists: true
        });
        
        // Add to ownership history
        ownershipHistory[_propertyID].push(OwnershipHistory({
            owner: _owner,
            transactionType: _transactionType,
            timestamp: block.timestamp,
            documentHash: _documentHash
        }));
        
        // Add to owner's property list
        ownerToProperties[_owner].push(_propertyID);
        
        // Mark property as existing
        propertyExists[_propertyID] = true;
        totalProperties++;
        
        emit PropertyRegistered(
            _propertyID,
            _owner,
            _documentHash,
            _transactionType,
            block.timestamp
        );
    }
    
    /**
     * @dev Change the registrar address
     * @param _newRegistrar Address of the new registrar
     */
    function changeRegistrar(address _newRegistrar) public onlyRegistrar {
        require(_newRegistrar != address(0), "Invalid registrar address");
        
        address oldRegistrar = registrar;
        registrar = _newRegistrar;
        
        emit RegistrarChanged(oldRegistrar, _newRegistrar, block.timestamp);
    }
    
    // ============ Owner Functions ============
    
    /**
     * @dev Transfer ownership of a property
     * @param _propertyID ID of the property to transfer
     * @param _newOwner Address of the new owner
     * @param _documentHash IPFS hash of the transfer document
     * @param _transactionType Type of transaction
     */
    function transferOwnership(
        string memory _propertyID,
        address _newOwner,
        string memory _documentHash,
        string memory _transactionType
    ) public propertyMustExist(_propertyID) onlyPropertyOwner(_propertyID) {
        require(_newOwner != address(0), "Invalid new owner address");
        require(_newOwner != msg.sender, "Cannot transfer to yourself");
        require(bytes(_documentHash).length > 0, "Document hash cannot be empty");
        
        address previousOwner = properties[_propertyID].currentOwner;
        
        // Update property details
        properties[_propertyID].previousOwner = previousOwner;
        properties[_propertyID].currentOwner = _newOwner;
        properties[_propertyID].documentHash = _documentHash;
        properties[_propertyID].transactionType = _transactionType;
        properties[_propertyID].timestamp = block.timestamp;
        
        // Add to ownership history
        ownershipHistory[_propertyID].push(OwnershipHistory({
            owner: _newOwner,
            transactionType: _transactionType,
            timestamp: block.timestamp,
            documentHash: _documentHash
        }));
        
        // Update owner mappings
        _removePropertyFromOwner(previousOwner, _propertyID);
        ownerToProperties[_newOwner].push(_propertyID);
        
        emit OwnershipTransferred(
            _propertyID,
            previousOwner,
            _newOwner,
            _transactionType,
            _documentHash,
            block.timestamp
        );
    }
    
    /**
     * @dev Add a digital signature to a property
     * @param _propertyID ID of the property
     * @param _signature Digital signature string
     */
    function addDigitalSignature(
        string memory _propertyID,
        string memory _signature
    ) public propertyMustExist(_propertyID) onlyPropertyOwner(_propertyID) {
        require(bytes(_signature).length > 0, "Signature cannot be empty");
        
        digitalSignatures[_propertyID].push(_signature);
        
        emit SignatureAdded(_propertyID, _signature, block.timestamp);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get property details
     * @param _propertyID ID of the property
     */
    function getProperty(string memory _propertyID)
        public
        view
        propertyMustExist(_propertyID)
        returns (
            string memory propertyID,
            address currentOwner,
            address previousOwner,
            string memory documentHash,
            string memory transactionType,
            uint256 timestamp
        )
    {
        Property memory prop = properties[_propertyID];
        return (
            prop.propertyID,
            prop.currentOwner,
            prop.previousOwner,
            prop.documentHash,
            prop.transactionType,
            prop.timestamp
        );
    }
    
    /**
     * @dev Get complete ownership history of a property
     * @param _propertyID ID of the property
     */
    function getOwnershipHistory(string memory _propertyID)
        public
        view
        propertyMustExist(_propertyID)
        returns (OwnershipHistory[] memory)
    {
        return ownershipHistory[_propertyID];
    }
    
    /**
     * @dev Get all digital signatures for a property
     * @param _propertyID ID of the property
     */
    function getDigitalSignatures(string memory _propertyID)
        public
        view
        propertyMustExist(_propertyID)
        returns (string[] memory)
    {
        return digitalSignatures[_propertyID];
    }
    
    /**
     * @dev Get all properties owned by an address
     * @param _owner Address of the owner
     */
    function getPropertiesByOwner(address _owner)
        public
        view
        returns (string[] memory)
    {
        return ownerToProperties[_owner];
    }
    
    /**
     * @dev Get the current owner of a property
     * @param _propertyID ID of the property
     */
    function getCurrentOwner(string memory _propertyID)
        public
        view
        propertyMustExist(_propertyID)
        returns (address)
    {
        return properties[_propertyID].currentOwner;
    }
    
    /**
     * @dev Check if an address is the owner of a property
     * @param _propertyID ID of the property
     * @param _owner Address to check
     */
    function isOwner(string memory _propertyID, address _owner)
        public
        view
        propertyMustExist(_propertyID)
        returns (bool)
    {
        return properties[_propertyID].currentOwner == _owner;
    }
    
    /**
     * @dev Get the number of times a property has changed hands
     * @param _propertyID ID of the property
     */
    function getTransferCount(string memory _propertyID)
        public
        view
        propertyMustExist(_propertyID)
        returns (uint256)
    {
        return ownershipHistory[_propertyID].length;
    }
    
    // ============ Internal Functions ============
    
    /**
     * @dev Remove a property from an owner's list
     * @param _owner Address of the owner
     * @param _propertyID ID of the property to remove
     */
    function _removePropertyFromOwner(address _owner, string memory _propertyID)
        internal
    {
        string[] storage properties = ownerToProperties[_owner];
        for (uint256 i = 0; i < properties.length; i++) {
            if (keccak256(bytes(properties[i])) == keccak256(bytes(_propertyID))) {
                // Move the last element to this position and pop
                properties[i] = properties[properties.length - 1];
                properties.pop();
                break;
            }
        }
    }
}