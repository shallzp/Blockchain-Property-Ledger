import { useCallback, useState } from 'react';

import { useWeb3 } from '../context/Web3Context';

const EVENT_TYPE_MAP = {
  UserRegistered: 'User Registered',
  UserVerified: 'User Verified',
  RegionalAdminAdded: 'Regional Admin Added',
  UserApproved: 'User Approved',
  LandAdded: 'Property Added',
  PropertyOnSale: 'Property Listed',
  PurchaseRequestSent: 'Purchase Request Sent',
  SaleAccepted: 'Sale Accepted',
};

const CONTRACT_LABELS = {
  userRegistry: 'User Registry',
  propertyRegistry: 'Property Registry',
  propertyExchange: 'Property Exchange',
};

const pickArg = (returnValues, ...keys) => {
  if (!returnValues) return null;
  for (const key of keys) {
    if (returnValues[key] !== undefined && returnValues[key] !== null) {
      return returnValues[key];
    }
  }
  return null;
};

const sanitizeArgs = (returnValues) => {
  if (!returnValues) return {};

  const cleaned = {};
  Object.entries(returnValues).forEach(([key, value]) => {
    if (!Number.isNaN(Number(key))) return;
    cleaned[key] = typeof value === 'bigint' ? value.toString() : value;
  });
  return cleaned;
};

const resolveActors = (eventName, returnValues) => {
  switch (eventName) {
    case 'UserRegistered':
    case 'UserVerified':
    case 'RegionalAdminAdded':
    case 'UserApproved':
      return { from: null, to: pickArg(returnValues, 'userID') };
    case 'LandAdded':
      return { from: pickArg(returnValues, 'owner'), to: null };
    case 'PropertyOnSale':
      return { from: pickArg(returnValues, 'owner'), to: null };
    case 'PurchaseRequestSent':
      return { from: pickArg(returnValues, 'requestedUser'), to: null };
    case 'SaleAccepted':
      return { from: null, to: pickArg(returnValues, 'buyer') };
    default:
      return { from: null, to: null };
  }
};

export const useTransactionAudit = () => {
  const { contracts, contractAddresses, web3 } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllTransactions = useCallback(
    async (options = {}) => {
      const { limit } = options;

      if (!web3) {
        throw new Error('Web3 is not initialized');
      }

      const auditContracts = [
        ['userRegistry', contracts.userRegistry],
        ['propertyRegistry', contracts.propertyRegistry],
        ['propertyExchange', contracts.propertyExchange],
      ].filter(([, contract]) => Boolean(contract));

      if (!auditContracts.length) {
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const eventGroups = await Promise.all(
          auditContracts.map(async ([contractKey, contract]) => {
            const events = await contract.getPastEvents('allEvents', {
              fromBlock: 0,
              toBlock: 'latest',
            });

            return events.map((event) => ({
              ...event,
              __contractKey: contractKey,
            }));
          })
        );

        const allEvents = eventGroups.flat();
        const blockTimestampCache = new Map();

        const txs = await Promise.all(
          allEvents.map(async (event) => {
            const blockNumber = Number(event.blockNumber || 0);
            let timestamp = null;

            if (blockNumber > 0) {
              if (!blockTimestampCache.has(blockNumber)) {
                const block = await web3.eth.getBlock(blockNumber);
                const blockTimestamp = Number(block?.timestamp || 0);
                blockTimestampCache.set(
                  blockNumber,
                  Number.isFinite(blockTimestamp) && blockTimestamp > 0
                    ? blockTimestamp * 1000
                    : null
                );
              }
              timestamp = blockTimestampCache.get(blockNumber);
            }

            const eventName = event.event || 'UnknownEvent';
            const actors = resolveActors(eventName, event.returnValues);
            const logIndex = Number(event.logIndex || 0);

            return {
              id: `${event.transactionHash}-${logIndex}-${eventName}`,
              txHash: event.transactionHash,
              blockNumber,
              logIndex,
              type: EVENT_TYPE_MAP[eventName] || 'Contract Activity',
              event: eventName,
              contractName: CONTRACT_LABELS[event.__contractKey] || 'Unknown Contract',
              contractAddress:
                contractAddresses[event.__contractKey] || event.address || null,
              from: actors.from,
              to: actors.to,
              status: 'success',
              timestamp,
              args: sanitizeArgs(event.returnValues),
            };
          })
        );

        txs.sort((a, b) => {
          if (b.blockNumber !== a.blockNumber) return b.blockNumber - a.blockNumber;
          return b.logIndex - a.logIndex;
        });

        if (Number.isInteger(limit) && limit > 0) {
          return txs.slice(0, limit);
        }

        return txs;
      } catch (err) {
        console.error('Error fetching audit transactions:', err);
        setError(err.message || 'Failed to fetch audit transactions');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [
      contractAddresses,
      contracts.propertyExchange,
      contracts.propertyRegistry,
      contracts.userRegistry,
      web3,
    ]
  );

  return { getAllTransactions, loading, error };
};
