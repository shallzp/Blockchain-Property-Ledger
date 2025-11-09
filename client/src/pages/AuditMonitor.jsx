import { useState, useEffect } from 'react';
import { Loader, AlertCircle, CheckCircle, XCircle, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import { useNavItems } from '../components/AuthWrapper';
import { useWeb3 } from '../context/Web3Context';
import { useTransactionAudit } from '../hooks/useTransactionAudit';

const AuditMonitor = () => {
  const navigate = useNavigate();
  const navItems = useNavItems();
  const { isConnected, currentAccount, loading: web3Loading } = useWeb3();
  const { getAllTransactions, loading: auditLoading } = useTransactionAudit();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredTx, setFilteredTx] = useState([]);

  useEffect(() => {
    if (!web3Loading && !isConnected) {
      navigate('/');
      return;
    }
    // Add Main Admin role check here if needed
  }, [isConnected, web3Loading, navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (isConnected) {
        setLoading(true);
        try {
          const txs = await getAllTransactions();
          setTransactions(txs);
          setFilteredTx(txs);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTransactions();
  }, [isConnected, getAllTransactions]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredTx(transactions);
      return;
    }
    const lower = search.toLowerCase();
    const filtered = transactions.filter(tx =>
      (tx.txHash && tx.txHash.toLowerCase().includes(lower)) ||
      (tx.from && tx.from.toLowerCase().includes(lower)) ||
      (tx.to && tx.to.toLowerCase().includes(lower)) ||
      (tx.type && tx.type.toLowerCase().includes(lower))
    );
    setFilteredTx(filtered);
  }, [search, transactions]);

  if (web3Loading || loading || auditLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar userRole="Main Administrator" walletAdd={currentAccount} navItems={navItems} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader className="w-16 h-16 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar userRole="Main Administrator" walletAdd={currentAccount} navItems={navItems} />

      <div className="max-w-7xl mx-auto px-8 py-12">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Transaction Monitor & Audit</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Tx Hash, From, To or Type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
        </header>

        {filteredTx.length === 0 ? (
          <div className="bg-white shadow-lg rounded-2xl p-12 text-center border border-dashed border-gray-300">
            <AlertCircle className="mx-auto w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Transactions Found</h2>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
            <table className="w-full text-left">
              <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                <tr>
                  <th className="px-4 py-3">Tx Hash</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredTx.map(tx => (
                  <tr key={tx.txHash} className="hover:bg-orange-50 cursor-pointer">
                    <td className="whitespace-nowrap px-4 py-2 font-mono">
                      {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-mono">{tx.from}</td>
                    <td className="whitespace-nowrap px-4 py-2 font-mono">{tx.to}</td>
                    <td className="px-4 py-2 capitalize">{tx.type}</td>
                    <td className="px-4 py-2">
                      {tx.status === 'success' ? (
                        <CheckCircle className="text-green-600 w-5 h-5 inline" />
                      ) : (
                        <XCircle className="text-red-600 w-5 h-5 inline" />
                      )}
                    </td>
                    <td className="px-4 py-2">{tx.event}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-center">
                      <button
                        onClick={() => alert(JSON.stringify(tx.args, null, 2))}
                        className="text-orange-600 hover:text-orange-700 flex items-center justify-center gap-1"
                      >
                        <ChevronRight className="w-5 h-5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditMonitor;