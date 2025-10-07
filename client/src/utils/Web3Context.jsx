import { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import PropertyRegistry from '../contracts/PropertyRegistry.json';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initWeb3();
  }, []);

  const initWeb3 = async () => {
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create Web3 instance
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Get user accounts
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        // Get network ID
        const networkId = await web3Instance.eth.net.getId();
        setNetworkId(networkId);

        // Get deployed contract
        const deployedNetwork = PropertyRegistry.networks[networkId];
        
        if (deployedNetwork) {
          const contractInstance = new web3Instance.eth.Contract(
            PropertyRegistry.abi,
            deployedNetwork.address
          );
          setContract(contractInstance);
        } else {
          alert('Contract not deployed to detected network');
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccounts(accounts);
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error initializing Web3:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Web3Context.Provider value={{ web3, accounts, contract, networkId, loading }}>
      {children}
    </Web3Context.Provider>
  );
};