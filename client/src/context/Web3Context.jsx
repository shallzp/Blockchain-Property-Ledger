import { createContext, useState, useEffect, useContext } from 'react';
import Web3 from 'web3';

import UserRegistry from '../contracts/UserRegistry.json';
import PropertyRegistry from '../contracts/PropertyRegistry.json';
import PropertyLedger from '../contracts/PropertyLedger.json';
import PropertyExchange from '../contracts/PropertyExchange.json';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [networkId, setNetworkId] = useState(null);
  const [chainName, setChainName] = useState('');
  const [contracts, setContracts] = useState({
    userRegistry: null,
    propertyRegistry: null,
    propertyLedger: null,
    propertyExchange: null,
  });
  const [contractAddresses, setContractAddresses] = useState({
    userRegistry: null,
    propertyRegistry: null,
    propertyLedger: null,
    propertyExchange: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Network names mapping
  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet',
      5777: 'Ganache Local',
      1337: 'Localhost',
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  // Initialize Web3
  useEffect(() => {
    const init = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Get network ID without requesting accounts first
          const networkId = await web3Instance.eth.net.getId();
          setNetworkId(Number(networkId));
          setChainName(getNetworkName(Number(networkId)));

          // Check if already connected
          const accounts = await web3Instance.eth.getAccounts();
          if (accounts.length > 0) {
            setAccounts(accounts);
            setCurrentAccount(accounts[0]);
            setIsConnected(true);
            await getBalance(web3Instance, accounts[0]);
            await loadContracts(web3Instance, Number(networkId));
          }

          // Listen for account changes
          window.ethereum.on('accountsChanged', handleAccountsChanged);

          // Listen for network changes
          window.ethereum.on('chainChanged', handleChainChanged);

          setLoading(false);
        } else {
          setError('Please install MetaMask to use this application');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing Web3:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    init();

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Get account balance
  const getBalance = async (web3Instance, address) => {
    try {
      const balanceWei = await web3Instance.eth.getBalance(address);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
      setBalance(parseFloat(balanceEth).toFixed(4));
    } catch (err) {
      console.error('Error getting balance:', err);
      setBalance('0');
    }
  };

  // Load contract instances
  const loadContracts = async (web3Instance, networkId) => {
    try {
      // Get deployed contract addresses from network
      const userRegistryAddress = UserRegistry.networks[networkId]?.address;
      const propertyRegistryAddress = PropertyRegistry.networks[networkId]?.address;
      const propertyExchangeAddress = PropertyExchange.networks[networkId]?.address;

      if (!userRegistryAddress || !propertyRegistryAddress || !propertyExchangeAddress) {
        throw new Error(`Contracts not deployed on network ${networkId} (${getNetworkName(networkId)}). Please ensure you're connected to Ganache.`);
      }

      // Create contract instances
      const userRegistryInstance = new web3Instance.eth.Contract(
        UserRegistry.abi,
        userRegistryAddress
      );

      const propertyRegistryInstance = new web3Instance.eth.Contract(
        PropertyRegistry.abi,
        propertyRegistryAddress
      );

      const propertyExchangeInstance = new web3Instance.eth.Contract(
        PropertyExchange.abi,
        propertyExchangeAddress
      );

      // Get PropertyLedger address from PropertyRegistry
      const propertyLedgerAddress = await propertyRegistryInstance.methods
        .getPropertiesContract()
        .call();

      const propertyLedgerInstance = new web3Instance.eth.Contract(
        PropertyLedger.abi,
        propertyLedgerAddress
      );

      setContracts({
        userRegistry: userRegistryInstance,
        propertyRegistry: propertyRegistryInstance,
        propertyLedger: propertyLedgerInstance,
        propertyExchange: propertyExchangeInstance,
      });

      setContractAddresses({
        userRegistry: userRegistryAddress,
        propertyRegistry: propertyRegistryAddress,
        propertyLedger: propertyLedgerAddress,
        propertyExchange: propertyExchangeAddress,
      });

      console.log('Contracts loaded successfully');
      console.log('Contract Addresses:', {
        userRegistry: userRegistryAddress,
        propertyRegistry: propertyRegistryAddress,
        propertyLedger: propertyLedgerAddress,
        propertyExchange: propertyExchangeAddress,
      });
    } catch (err) {
      console.error('Error loading contracts:', err);
      setError(err.message);
      throw err;
    }
  };

  // Handle account changes
  const handleAccountsChanged = async (newAccounts) => {
    if (newAccounts.length === 0) {
      // User disconnected wallet
      setCurrentAccount(null);
      setAccounts([]);
      setIsConnected(false);
      setBalance('0');
      setError('Please connect to MetaMask');
    } else {
      // User switched accounts
      setAccounts(newAccounts);
      setCurrentAccount(newAccounts[0]);
      setIsConnected(true);
      setError(null);
      
      if (web3) {
        await getBalance(web3, newAccounts[0]);
      }
    }
  };

  // Handle network changes
  const handleChainChanged = () => {
    window.location.reload();
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install it to use this app.');
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      setLoading(true);
      setError(null);

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setAccounts(accounts);
      setCurrentAccount(accounts[0]);
      setIsConnected(true);

       // Get balance
      if (web3) {
        await getBalance(web3, accounts[0]);
      }

      // Load contracts if not already loaded
      if (!contracts.userRegistry && web3 && networkId) {
        await loadContracts(web3, networkId);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      console.error('Error connecting wallet:', err);
      
      if (err.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
      
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setCurrentAccount(null);
    setAccounts([]);
    setIsConnected(false);
    setBalance('0');
    setError(null);
  };

  // Switch to Ganache network
  const switchToGanache = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1691' }], // 5777 in hex
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x1691',
                chainName: 'Ganache Local',
                rpcUrls: ['http://127.0.0.1:7545'],
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Ganache network:', addError);
          setError('Failed to add Ganache network to MetaMask');
        }
      } else {
        console.error('Error switching to Ganache:', switchError);
        setError('Failed to switch to Ganache network');
      }
    }
  };

  const value = {
    web3,
    accounts,
    currentAccount,
    balance,
    networkId,
    chainName,
    contracts,
    contractAddresses,
    loading,
    error,
    isConnected,
    connectWallet,
    disconnectWallet,
    switchToGanache,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
