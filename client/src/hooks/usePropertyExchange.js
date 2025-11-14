import { useState, useCallback } from 'react';
import { useWeb3 } from '../context/Web3Context';

export const usePropertyExchange = () => {
  const { contracts, currentAccount, web3 } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add property on sale
  const addPropertyOnSale = useCallback(async (propertyId, priceInEther) => {
    if (!contracts.propertyExchange) {
      throw new Error('PropertyExchange contract not loaded');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await contracts.propertyExchange.methods
        .addPropertyOnSale(propertyId, priceInEther)
        .send({ from: currentAccount });

      setLoading(false);
      return result;
    } catch (err) {
      console.error(err);
      const errorMsg = err.message || 'Failed to add property on sale';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyExchange, currentAccount, web3]);

  // Get my sales
  const getMySales = useCallback(async (ownerAddress) => {
    if (!contracts.propertyExchange) {
      throw new Error('PropertyExchange contract not loaded');
    }

    try {
      const targetAddress = ownerAddress || currentAccount;
      const sales = await contracts.propertyExchange.methods
        .getMySales(targetAddress)
        .call();

      return sales.map((sale) => ({
        saleId: parseInt(sale.saleId),
        owner: sale.owner,
        price: web3.utils.fromWei(sale.price.toString(), 'ether'),
        propertyId: parseInt(sale.propertyId),
        acceptedFor: sale.acceptedFor,
        acceptedPrice: web3.utils.fromWei(sale.acceptedPrice.toString(), 'ether'),
        acceptedTime: parseInt(sale.acceptedTime),
        paymentDone: sale.paymentDone,
        state: parseInt(sale.state),
        acceptedRequestId: parseInt(sale.acceptedRequestId),
        deadlineForPayment: parseInt(sale.deadlineForPayment),
      }));
    } catch (err) {
      console.error(err);
      const errorMsg = err.message || 'Failed to get sales';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyExchange, currentAccount, web3]);

  // Get requested sales
  const getRequestedSales = useCallback(async (buyerAddress) => {
    if (!contracts.propertyExchange) {
      throw new Error('PropertyExchange contract not loaded');
    }

    try {
      const targetAddress = buyerAddress || currentAccount;
      const sales = await contracts.propertyExchange.methods
        .getRequestedSales(targetAddress)
        .call();

      return sales.map((sale) => ({
        saleId: parseInt(sale.saleId),
        owner: sale.owner,
        price: web3.utils.fromWei(sale.price.toString(), 'ether'),
        propertyId: parseInt(sale.propertyId),
        acceptedFor: sale.acceptedFor,
        acceptedPrice: web3.utils.fromWei(sale.acceptedPrice.toString(), 'ether'),
        acceptedTime: parseInt(sale.acceptedTime),
        paymentDone: sale.paymentDone,
        state: parseInt(sale.state),
        deadlineForPayment: parseInt(sale.deadlineForPayment),
      }));
    } catch (err) {
      console.error(err);
      const errorMsg = err.message || 'Failed to get requested sales';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyExchange, currentAccount, web3]);

  // Send purchase request
  const sendPurchaseRequest = useCallback(async (saleId, offerPriceInEther) => {
    if (!contracts.propertyExchange) throw new Error("PropertyExchange contract not loaded");
    if (!saleId || !offerPriceInEther) throw new Error("Invalid saleId or offerPrice");
    setLoading(true);
    setError(null);
    try {
      // Pass gas limit explicitly to avoid gas estimation issues
      const result = await contracts.propertyExchange.methods
        .sendPurchaseRequest(saleId, offerPriceInEther)
        .send({ 
          from: currentAccount,
          // gas: 300000
        });
      setLoading(false);
      return result;
    } catch (err) {
      console.error("sendPurchaseRequest error:", err);
      const errorMsg = err.message || "Failed to send purchase request";
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyExchange, currentAccount]);


  // Accept buyer request
  const acceptBuyerRequest = useCallback(async (saleId, buyerAddress, priceInEther) => {
    if (!contracts.propertyExchange) {
      throw new Error('PropertyExchange contract not loaded');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await contracts.propertyExchange.methods
        .acceptBuyerRequest(saleId, buyerAddress, priceInEther)
        .send({ from: currentAccount });

      setLoading(false);
      return result;
    } catch (err) {
      console.error(err);
      const errorMsg = err.message || 'Failed to accept buyer request';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyExchange, currentAccount, web3]);

  // Transfer ownership (complete payment)
  const transferOwnership = useCallback(async (saleId, paymentInEther) => {
    if (!contracts.propertyExchange) {
      throw new Error('PropertyExchange contract not loaded');
    }

    setLoading(true);
    setError(null);
    try {
      const paymentInWei = web3.utils.toWei(paymentInEther.toString(), 'ether');

      const result = await contracts.propertyExchange.methods
        .transferOwnerShip(saleId)
        .send({
          from: currentAccount,
          value: paymentInWei,
        });

      setLoading(false);
      return result;
    } catch (err) {
      console.error(err);
      const errorMsg = err.message || 'Failed to transfer ownership';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyExchange, currentAccount, web3]);

  // Get sales by location
  const getSalesByLocation = useCallback(async (locationId) => {
    if (!contracts.propertyExchange) {
      throw new Error('PropertyExchange contract not loaded');
    }

    try {
      const sales = await contracts.propertyExchange.methods
        .getSalesByLocation(locationId)
        .call();

      return sales.map((sale) => ({
        saleId: parseInt(sale.saleId),
        owner: sale.owner,
        price: web3.utils.fromWei(sale.price.toString(), 'ether'),
        propertyId: parseInt(sale.propertyId),
        acceptedFor: sale.acceptedFor,
        state: parseInt(sale.state),
      }));
    } catch (err) {
      console.error(err);
      const errorMsg = err.message || 'Failed to get sales by location';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyExchange, web3]);

  // Get requested users for a sale
  const getRequestedUsers = useCallback(async (saleId) => {
    if (!contracts.propertyExchange) {
      throw new Error('PropertyExchange contract not loaded');
    }

    try {
      const users = await contracts.propertyExchange.methods
        .getRequestedUsers(saleId)
        .call();

      return users.map((user) => ({
        user: user.user,
        priceOffered: web3.utils.fromWei(user.priceOffered.toString(), 'ether'),
        state: parseInt(user.state),
        requestId: parseInt(user.requestId),
      }));
    } catch (err) {
      console.error(err);
      const errorMsg = err.message || 'Failed to get requested users';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyExchange, web3]);

  // Cancel sale by seller
  const cancelSale = useCallback(async (saleId) => {
    if (!contracts.propertyExchange) {
      throw new Error('PropertyExchange contract not loaded');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await contracts.propertyExchange.methods
        .cancelSaleBySeller(saleId)
        .send({ from: currentAccount });

      setLoading(false);
      return result;
    } catch (err) {
      console.error('Failed to cancel sale:', err);
      const errorMsg = err.message || 'Failed to cancel sale';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [contracts.propertyExchange, currentAccount]);


  return {
    addPropertyOnSale,
    getMySales,
    getRequestedSales,
    sendPurchaseRequest,
    acceptBuyerRequest,
    transferOwnership,
    getSalesByLocation,
    getRequestedUsers,
    cancelSale,
    loading,
    error,
  };
};