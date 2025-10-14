const UserRegistry = artifacts.require("UserRegistry");
const PropertyRegistry = artifacts.require("PropertyRegistry");
const PropertyExchange = artifacts.require("PropertyExchange");

module.exports = function(deployer, network, accounts) {
  console.log("List of available accounts:", accounts);
  console.log("Deploying from account:", accounts[0]);

  // Main Admin Profile Info - customize these values
  const firstName = "Shalini";
  const lastName = "Patel";
  const dateOfBirth = "2004-08-05";
  const aadharNumber = "1111-2222-3333";
  const resAddress = "Sudama Nagar, Indore";
  const email = "shalini.patel050408@gmail.com";
  const aadharFileHash = "QmQ3BnTaszRiZXC3XTo4DWf4XWJHjqXUnp6EjAGTPbBWmp";

  let propertyRegistryInstance;

  // Step 1: Deploy UserRegistry with main admin profile
  deployer.deploy(
    UserRegistry,
    firstName,
    lastName,
    dateOfBirth,
    aadharNumber,
    resAddress,
    email,
    aadharFileHash
  ).then(() => {
    console.log("UserRegistry deployed at:", UserRegistry.address);
    return UserRegistry.deployed();
  })
  .then(() => {
    // Step 2: Deploy PropertyRegistry, which deploys PropertyLedger internally
    return deployer.deploy(PropertyRegistry);
  })
  .then(() => {
    console.log("PropertyRegistry deployed at:", PropertyRegistry.address);
    return PropertyRegistry.deployed();
  })
  .then((instance) => {
    propertyRegistryInstance = instance;
    
    // Step 3: Deploy PropertyExchange with PropertyRegistry address
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

    // Get PropertyLedger address
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