const UserRegistry = artifacts.require("UserRegistry");
const PropertyRegistry = artifacts.require("PropertyRegistry");
const PropertyExchange = artifacts.require("PropertyExchange");

module.exports = async function (deployer, network, accounts) {
  console.log("List of available accounts:", accounts);
  console.log("Deploying from account:", accounts[0]);


  // Profiles for main admin and initial regional admin
  const mainAdminProfile = {
    firstName: "Shalini",
    lastName: "Patel",
    dateOfBirth: "2004-08-05",
    aadharNumber: "1111-2222-3333",
    resAddress: "Sudama Nagar, Indore",
    email: "shalini.patel050408@gmail.com",
    aadharFileHash: ""
  };


  const initialRegionalAdminProfile = {
    firstName: "Regional",
    lastName: "Admin",
    dateOfBirth: "1980-01-01",
    aadharNumber: "1234-5678-9012",
    resAddress: "admin address",
    email: "regional.admin@example.com",
    aadharFileHash: ""
  };


  const initialRegionalAdminAddress = accounts[1];


  // Users to register & verify
  const extraUsers = [
    {
      account: "0xf46De24E325120d8EE272083889D7b647D180dbd",
      firstName: "User1",
      lastName: "One",
      dateOfBirth: "1990-01-01",
      aadharNumber: "1111-0000-0000",
      resAddress: "Address 1",
      email: "user1@example.com",
      aadharFileHash: ""
    },
    {
      account: "0x73e9E4991035cBa8c25f348bf7344c906B5E75b8",
      firstName: "User2",
      lastName: "Two",
      dateOfBirth: "1995-02-02",
      aadharNumber: "2222-0000-0000",
      resAddress: "Address 2",
      email: "user2@example.com",
      aadharFileHash: ""
    }
  ];


  // Deploy UserRegistry
  await deployer.deploy(
    UserRegistry,
    mainAdminProfile,
    initialRegionalAdminAddress,
    initialRegionalAdminProfile
  );
  const userRegistryInstance = await UserRegistry.deployed();
  console.log("UserRegistry deployed at:", userRegistryInstance.address);


  // Register extra users
  for (const u of extraUsers) {
    await userRegistryInstance.registerUser(
      u.firstName,
      u.lastName,
      u.dateOfBirth,
      u.aadharNumber,
      u.resAddress,
      u.email,
      u.aadharFileHash,
      { from: u.account }
    );
    console.log(`User registered: ${u.firstName} ${u.lastName} [${u.account}]`);
  }


  // Verify users using initial regional admin address
  for (const u of extraUsers) {
    await userRegistryInstance.verifyUser(u.account, { from: initialRegionalAdminAddress });
    console.log(`User verified: ${u.account}`);
  }


  // Deploy PropertyRegistry and PropertyExchange
  await deployer.deploy(PropertyRegistry);
  const propertyRegistryInstance = await PropertyRegistry.deployed();

  // Map revenue department(s) to the initial regional admin (example revenueDeptId: 1)
  await propertyRegistryInstance.mapRevenueDeptIdToEmployee(1, initialRegionalAdminAddress, { from: accounts[0] });
  console.log(`Mapped revenue department ID 1 to employee ${initialRegionalAdminAddress}`);


  await deployer.deploy(PropertyExchange, propertyRegistryInstance.address);
  console.log("PropertyRegistry deployed at:", propertyRegistryInstance.address);


  const propertyExchangeInstance = await PropertyExchange.deployed();
  console.log("PropertyExchange deployed at:", propertyExchangeInstance.address);


  console.log("\n=== Deployment Summary ===");
  console.log("UserRegistry:", userRegistryInstance.address);
  console.log("PropertyRegistry:", propertyRegistryInstance.address);
  console.log("PropertyExchange:", propertyExchangeInstance.address);
  console.log("Main Administrator:", accounts[0]);
  console.log("Initial Regional Admin:", initialRegionalAdminAddress);
  console.log("Extra Users:", extraUsers.map(u => u.account));
};