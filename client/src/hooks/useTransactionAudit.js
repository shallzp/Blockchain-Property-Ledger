import { useCallback, useState } from 'react';
import { ethers } from 'ethers';

import { useWeb3 } from '../context/Web3Context';
import PropertyExchangeABI from '../contracts/PropertyExchange.json';
import PropertyLedgerABI from '../contracts/PropertyLedger.json';

// Replace these with actual deployed addresses
const PROPERTY_EXCHANGE_ADDRESS = '0xYourPropertyExchangeAddress';
const PROPERTY_LEDGER_ADDRESS = '0xYourPropertyLedgerAddress';

export const useTransactionAudit = () => {
  const { provider } = useWeb3();
  const [loading, setLoading] = useState(false);

  const getAllTransactions = useCallback(async () => {
    setLoading(true);
    try {
      if (!provider) throw new Error('Provider unavailable');

      // Instantiate contracts
      const exchange = new ethers.Contract(PROPERTY_EXCHANGE_ADDRESS, PropertyExchangeABI, provider);
      const ledger = new ethers.Contract(PROPERTY_LEDGER_ADDRESS, PropertyLedgerABI, provider);

      // Define event queries for key events (customize as per your contract)
      const eventPromises = [
        exchange.queryFilter(exchange.filters.PropertyOnSale()),        // property listed
        exchange.queryFilter(exchange.filters.PurchaseRequestSent()),   // request sent
        exchange.queryFilter(exchange.filters.SaleAccepted()),          // seller accepted buyer
        // Add other events (if desired)
      ];

      const allEvents = (await Promise.all(eventPromises)).flat();

      // Basic normalization. You can extend this with more event parameters.
      const txs = allEvents.map(e => {
        let type = 'Other', from = null, to = null;
        if (e.event === 'PropertyOnSale') {
          type = 'Property Listed';
          from = e.args.owner;
          to = null;
        } else if (e.event === 'PurchaseRequestSent') {
          type = 'Purchase Request';
          from = e.args.requestedUser;
          to = null;
        } else if (e.event === 'SaleAccepted') {
          type = 'Sale Accepted';
          from = e.args.buyer;
          to = e.address;
        }
        return {
          txHash: e.transactionHash,
          type,
          from,
          to,
          status: 'success', // All successfully emitted events imply success
          timestamp: (e.blockNumber ? null : null), // Optionally fetch block.timestamp
          event: e.event,
          args: e.args
        };
      });

      // Ideally, sort txs by blockNumber or timestamp (optional: fetch timestamp for each with provider)
      txs.sort((a, b) => (b.blockNumber || 0) - (a.blockNumber || 0));
      return txs;
    } catch (error) {
      console.error('Error fetching audit transactions:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider]);

  return { getAllTransactions, loading };
};
