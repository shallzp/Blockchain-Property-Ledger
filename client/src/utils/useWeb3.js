import { useState, useEffect } from 'react';

export default function useWeb3() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [chainId, setChainId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', () => window.location.reload());
      }
    };
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError('MetaMask not installed.');
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) connectWallet(accounts[0]);
  };

  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask not installed.');
        window.open('https://metamask.io/download/', '_blank');
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      connectWallet(accounts[0]);
    } catch (err) {
      setError(err.code === 4001 ? 'Connection rejected.' : 'Failed to connect.');
    }
  };

  const connectWallet = async (address) => {
    setIsConnected(true);
    setWalletAddress(address);
    await getBalance(address);
    await getChainId();
  };

  const getBalance = async (address) => {
    const balanceWei = await window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] });
    const balanceEth = parseInt(balanceWei, 16) / 1e18;
    setBalance(balanceEth.toFixed(4));
  };

  const getChainId = async () => {
    const chainHex = await window.ethereum.request({ method: 'eth_chainId' });
    const chainDec = parseInt(chainHex, 16);
    const networks = {
      1: 'Ethereum Mainnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet',
    };
    setChainId(networks[chainDec] || `Chain ID: ${chainDec}`);
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) setIsConnected(false);
    else connectWallet(accounts[0]);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance('');
    setChainId('');
    setError('');
  };

  return {
    isConnected,
    walletAddress,
    balance,
    chainId,
    error,
    handleConnectWallet,
    disconnectWallet,
  };
}
