// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.21;

contract UserRegistry {

    enum Role { None, MainAdministrator, RegionalAdmin, User }

    struct User {
        address userID;
        string firstName;
        string lastName;
        string dateOfBirth;
        string aadharNumber;
        string resAddress;
        string email;
        string aadharFileHash; // IPFS hash of Aadhar PDF
        Role role;
        bool verified; // true only after admin verification
        uint256 accountCreatedDateTime;
        uint totalIndices; //Number of properties owned by the user
        uint requestIndices; //Number of purchase requests made by the user
    }

    mapping(address => bool) public registeredUsers;
    mapping(address => User) public users;
    mapping(string => bool) private aadharNumbers;
    mapping(address => bool) public regionalAdmins;

    uint private countRegionalAdmins;

    address public mainAdministrator;

    event UserRegistered(address indexed userID, Role role, uint256 indexed accountCreatedDateTime);
    event UserVerified(address indexed userID, Role role); //for User
    event RegionalAdminAdded(address indexed userID);
    event UserApproved(address indexed userID); //for Regional Admin

    modifier onlyMainAdministrator() {
        require(msg.sender == mainAdministrator, "Only Main Administrator can perform this action");
        _;
    }

    modifier onlyRegionalAdmin() {
        require(users[msg.sender].role == Role.RegionalAdmin && users[msg.sender].verified, "Only verified Regional Admin");
        _;
    }

    // First wallet becomes system deployer
    constructor() {
        mainAdministrator = msg.sender;
        users[msg.sender] = User({
            userID: msg.sender,
            firstName: "Main",
            lastName: "Administrator",
            dateOfBirth: "",
            aadharNumber: "N/A",
            resAddress: "N/A",
            email: "",
            aadharFileHash: "",
            role: Role.MainAdministrator,
            verified: true,
            accountCreatedDateTime: block.timestamp,
            totalIndices: 0,  
            requestIndices: 0 
        });
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender, Role.MainAdministrator, block.timestamp);
    }

    // Register New User
    function registerUser(
        string memory _firstName,
        string memory _lastName,
        string memory _dateOfBirth,
        string memory _aadharNumber,
        string memory _resAddress,
        string memory _email,
        string memory _aadharFileHash
    ) public {
        require(!registeredUsers[msg.sender], "User already registered");
        require(!aadharNumbers[_aadharNumber], "Aadhar number already registered");

        User memory newUser = User({
            userID: msg.sender,
            firstName: _firstName,
            lastName: _lastName,
            dateOfBirth: _dateOfBirth,
            aadharNumber: _aadharNumber,
            resAddress: _resAddress,
            email: _email,
            aadharFileHash: _aadharFileHash,
            role: Role.User, // Default role
            verified: false,
            accountCreatedDateTime: block.timestamp,
            totalIndices: 0,  
            requestIndices: 0 
        });

        users[msg.sender] = newUser;
        registeredUsers[msg.sender] = true;
        aadharNumbers[_aadharNumber] = true;

        emit UserRegistered(msg.sender, Role.User, block.timestamp);
    }

    // Main Admin adds Regional Admin
    function addRegionalAdmin(address _adminAddress) external onlyMainAdministrator {
        require(registeredUsers[_adminAddress], "User not registered");
        
        users[_adminAddress].role = Role.RegionalAdmin;
        users[_adminAddress].verified = true;

        regionalAdmins[_adminAddress] = true;
        countRegionalAdmins++;

        emit RegionalAdminAdded(_adminAddress);
        emit UserVerified(_adminAddress, Role.RegionalAdmin);
    }

    // Regional Admin verifies Users
    function verifyUser(address _userAddress) external onlyRegionalAdmin {
        require(registeredUsers[_userAddress], "User not registered");
        require(users[_userAddress].role == Role.User, "Not a general user account");
        
        users[_userAddress].verified = true;

        emit UserApproved(_userAddress);
        emit UserVerified(_userAddress, Role.User);
    }

    // Get User Details
    function getUserDetails(address _userId) public view returns (
        string memory firstName,
        string memory lastName,
        string memory dateOfBirth,
        string memory aadharNumber,
        string memory resAddress,
        string memory email,
        string memory aadharFileHash,
        string memory role,
        bool verified,
        uint256 accountCreated
    ) {
        require(users[_userId].userID != address(0), "User does not exist");

        User storage user = users[_userId];

        string memory roleString;
        if (user.role == Role.MainAdministrator) roleString = "Main Administrator";
        else if (user.role == Role.RegionalAdmin) roleString = "Regional Admin";
        else if (user.role == Role.User) roleString = "User";
        else roleString = "None";

        return (
            user.firstName,
            user.lastName,
            user.dateOfBirth,
            user.aadharNumber,
            user.resAddress,
            user.email,
            user.aadharFileHash,
            roleString,
            user.verified,
            user.accountCreatedDateTime
        );
    }

    // THIS Should be in property contratct
    function incrementTotalProperties(address _user) external {
        require(registeredUsers[_user], "User not registered");
        users[_user].totalIndices++;
    }

    function incrementRequests(address _user) external {
        require(registeredUsers[_user], "User not registered");
        users[_user].requestIndices++;
    }

    function isRegionalAdmin(address _user) public view returns (bool) {
        return regionalAdmins[_user];
    }
}
