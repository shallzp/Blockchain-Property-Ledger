module.exports = {

  networks: {
    development: {
     host: "127.0.0.1",     
     port: 7545,            
     network_id: "*",       
     gas: 6721975,
     gasPrice: 20000000000,
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.21",    
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }, 
      evmVersion: "london"
      }
    }
  },

  // Contract directory
  contracts_directory: './contracts',
  contracts_build_directory: './client/src/contracts',  // Important!
};
