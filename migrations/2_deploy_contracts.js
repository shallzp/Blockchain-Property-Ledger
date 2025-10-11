const UserRegistry = artifacts.require("UserRegistry");
const PropertyLedger = artifacts.require("PropertyLedger");
const PropertyRegistry = artifacts.require("PropertyRegistry");
const PropertyExchange = artifacts.require("PropertyExchange");

module.exports = function(deployer, network, accounts) {
  let userRegistryInstance;
  let propertyRegistryInstance;
  
  // Step 1: Deploy UserRegistry contract
  deployer.deploy(UserRegistry)
    .then(() => {
      console.log("UserRegistry deployed at:", UserRegistry.address);
      return UserRegistry.deployed();
    })
    .then((instance) => {
      userRegistryInstance = instance;
      
      // Step 2: Deploy PropertyRegistry contract
      // PropertyRegistry deploys PropertyLedger internally in its constructor
      return deployer.deploy(PropertyRegistry);
    })
    .then(() => {
      console.log("PropertyRegistry deployed at:", PropertyRegistry.address);
      return PropertyRegistry.deployed();
    })
    .then((instance) => {
      propertyRegistryInstance = instance;
      
      // Step 3: Deploy PropertyExchange contract
      // Pass PropertyRegistry address to PropertyExchange constructor
      return deployer.deploy(PropertyExchange, PropertyRegistry.address);
    })
    .then(() => {
      console.log("PropertyExchange deployed at:", PropertyExchange.address);
      return PropertyExchange.deployed();
    })
    .then((exchangeInstance) => {
      console.log("\n=== Deployment Summary ===");
      console.log("UserRegistry:", UserRegistry.address);
      console.log("PropertyRegistry:", PropertyRegistry.address);
      console.log("PropertyExchange:", PropertyExchange.address);
      
      // Get PropertyLedger address from PropertyRegistry
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
