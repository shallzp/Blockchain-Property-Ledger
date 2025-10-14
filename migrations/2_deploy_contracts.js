const UserRegistry = artifacts.require("UserRegistry");
const PropertyRegistry = artifacts.require("PropertyRegistry");
const PropertyExchange = artifacts.require("PropertyExchange");

module.exports = function(deployer, network, accounts) {
  console.log("List of available accounts:", accounts);
  console.log("Deploying from account:", accounts[0]);

  // Main Admin Profile Info as object matching UserProfile struct
  const mainAdminProfile = {
    firstName: "Shalini",
    lastName: "Patel",
    dateOfBirth: "2004-08-05",
    aadharNumber: "1111-2222-3333",
    resAddress: "Sudama Nagar, Indore",
    email: "shalini.patel050408@gmail.com",
    aadharFileHash: ""
  };

  // Initial Regional Admin Profile Info as object matching UserProfile struct
  const initialRegionalAdminProfile = {
    firstName: "Regional",
    lastName: "Admin",
    dateOfBirth: "1980-01-01",
    aadharNumber: "1234-5678-9012",
    resAddress: "Regional Admin Address",
    email: "regional.admin@example.com",
    aadharFileHash: ""
  };

  // Initial regional admin address
  const initialRegionalAdminAddress = "0x1531427f98B4DC4B90046c9010757365cE7A84da";

  let propertyRegistryInstance;

  // Deploy UserRegistry with two objects and one address as constructor parameters
  deployer.deploy(
    UserRegistry,
    mainAdminProfile,
    initialRegionalAdminAddress,
    initialRegionalAdminProfile
  )
  .then(() => {
    console.log("UserRegistry deployed at:", UserRegistry.address);
    return UserRegistry.deployed();
  })
  .then(() => {
    return deployer.deploy(PropertyRegistry);
  })
  .then(() => {
    console.log("PropertyRegistry deployed at:", PropertyRegistry.address);
    return PropertyRegistry.deployed();
  })
  .then((instance) => {
    propertyRegistryInstance = instance;
    return deployer.deploy(PropertyExchange, PropertyRegistry.address);
  })
  .then(() => {
    console.log("PropertyExchange deployed at:", PropertyExchange.address);
    return PropertyExchange.deployed();
  })
  .then(() => {
    console.log("\n=== Deployment Summary ===");
    console.log("UserRegistry:", UserRegistry.address);
    console.log("PropertyRegistry:", PropertyRegistry.address);
    console.log("PropertyExchange:", PropertyExchange.address);
    return propertyRegistryInstance.getPropertiesContract();
  })
  .then((propertyLedgerAddress) => {
    console.log("PropertyLedger:", propertyLedgerAddress);
    console.log("\nMain Administrator:", accounts[0]);
    console.log("=========================\n");
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
  });
};