import { useState, useCallback } from 'react';
import { useWeb3 } from '../context/Web3Context';

export const useUserRegistry = () => {
  const { contracts, currentAccount } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Register new user
  const registerUser = useCallback(async (userData) => {
    if (!contracts.userRegistry) {
      throw new Error('UserRegistry contract not loaded');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await contracts.userRegistry.methods
        .registerUser(
          userData.firstName,
          userData.lastName,
          userData.dateOfBirth,
          userData.aadharNumber,
          userData.resAddress,
          userData.email,
          userData.aadharFileHash
        )
        .send({ from: currentAccount });

      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to register user';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.userRegistry, currentAccount]);

  // Get user details
  const getUserDetails = useCallback(async (address) => {
    if (!contracts.userRegistry) {
      throw new Error('UserRegistry contract not loaded');
    }

    try {
      const targetAddress = address || currentAccount;
      const user = await contracts.userRegistry.methods
        .getUserDetails(targetAddress)
        .call();

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        aadharNumber: user.aadharNumber,
        resAddress: user.resAddress,
        email: user.email,
        aadharFileHash: user.aadharFileHash,
        role: user.role,
        verified: user.verified,
        accountCreated: user.accountCreated,
      };
    } catch (err) {
      const errorMsg = err.message || 'Failed to get user details';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.userRegistry, currentAccount]);

  // Check if user is registered
  const isUserRegistered = useCallback(async (address) => {
    if (!contracts.userRegistry) {
      throw new Error('UserRegistry contract not loaded');
    }

    try {
      const targetAddress = address || currentAccount;
      return await contracts.userRegistry.methods
        .registeredUsers(targetAddress)
        .call();
    } catch (err) {
      const errorMsg = err.message || 'Failed to check registration status';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.userRegistry, currentAccount]);

  // Check if user is verified
  const isUserVerified = useCallback(async (address) => {
    if (!contracts.userRegistry) {
      throw new Error('UserRegistry contract not loaded');
    }

    try {
      const targetAddress = address || currentAccount;
      const user = await contracts.userRegistry.methods
        .users(targetAddress)
        .call();
      return user.verified;
    } catch (err) {
      const errorMsg = err.message || 'Failed to check verification status';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.userRegistry, currentAccount]);

  // Verify user (Regional Admin only)
  const verifyUser = useCallback(async (userAddress) => {
    if (!contracts.userRegistry) {
      throw new Error('UserRegistry contract not loaded');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await contracts.userRegistry.methods
        .verifyUser(userAddress)
        .send({ from: currentAccount });

      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to verify user';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.userRegistry, currentAccount]);

  // Add regional admin (Main Admin only)
  const addRegionalAdmin = useCallback(async (adminAddress) => {
    if (!contracts.userRegistry) {
      throw new Error('UserRegistry contract not loaded');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await contracts.userRegistry.methods
        .addRegionalAdmin(adminAddress)
        .send({ from: currentAccount });

      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to add regional admin';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.userRegistry, currentAccount]);

  // Check if regional admin
  const isRegionalAdmin = useCallback(async (address) => {
    if (!contracts.userRegistry) {
      throw new Error('UserRegistry contract not loaded');
    }

    try {
      const targetAddress = address || currentAccount;
      return await contracts.userRegistry.methods
        .isRegionalAdmin(targetAddress)
        .call();
    } catch (err) {
      const errorMsg = err.message || 'Failed to check admin status';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.userRegistry, currentAccount]);

  return {
    registerUser,
    getUserDetails,
    isUserRegistered,
    isUserVerified,
    verifyUser,
    addRegionalAdmin,
    isRegionalAdmin,
    loading,
    error,
  };
};
