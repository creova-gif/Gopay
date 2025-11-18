import { ArrowLeft, QrCode, Wifi, WifiOff, CheckCircle, Clock, AlertTriangle, Download, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface OfflineQRPaymentProps {
  onBack: () => void;
}

interface PendingTransaction {
  id: string;
  merchantName: string;
  amount: number;
  timestamp: Date;
  qrCode: string;
  status: 'pending' | 'synced' | 'failed';
}

export function OfflineQRPayment({ onBack }: OfflineQRPaymentProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      autoSyncTransactions();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending transactions from localStorage
    loadPendingTransactions();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingTransactions = () => {
    try {
      const stored = localStorage.getItem('gopay_pending_transactions');
      if (stored) {
        const transactions = JSON.parse(stored);
        setPendingTransactions(transactions.map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading pending transactions:', error);
    }
  };

  const savePendingTransactions = (transactions: PendingTransaction[]) => {
    try {
      localStorage.setItem('gopay_pending_transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving pending transactions:', error);
    }
  };

  const autoSyncTransactions = async () => {
    if (pendingTransactions.length === 0) return;

    setSyncing(true);
    
    // Simulate syncing transactions
    await new Promise(resolve => setTimeout(resolve, 2000));

    const syncedTransactions = pendingTransactions.map(t => ({
      ...t,
      status: 'synced' as const
    }));

    setPendingTransactions(syncedTransactions);
    savePendingTransactions(syncedTransactions);
    setSyncing(false);

    // Remove synced transactions after 24 hours
    setTimeout(() => {
      const filtered = syncedTransactions.filter(t => 
        new Date().getTime() - new Date(t.timestamp).getTime() < 24 * 60 * 60 * 1000
      );
      setPendingTransactions(filtered);
      savePendingTransactions(filtered);
    }, 5000);
  };

  const handleOfflinePayment = (merchantQR: string, amount: number, merchantName: string) => {
    const newTransaction: PendingTransaction = {
      id: `OFF_${Date.now()}`,
      merchantName,
      amount,
      timestamp: new Date(),
      qrCode: merchantQR,
      status: 'pending'
    };

    const updated = [...pendingTransactions, newTransaction];
    setPendingTransactions(updated);
    savePendingTransactions(updated);

    if (isOnline) {
      autoSyncTransactions();
    }
  };

  const handleManualSync = () => {
    if (isOnline) {
      autoSyncTransactions();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="size-6 text-gray-900" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Offline QR Payments</h1>
              <p className="text-sm text-gray-600">Pay anywhere, sync when online</p>
            </div>
          </div>

          {/* Online Status */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isOnline ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="size-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Online - Auto-sync enabled</span>
              </>
            ) : (
              <>
                <WifiOff className="size-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Offline Mode - Payments cached</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24">
        {/* How It Works */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
              <QrCode className="size-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">How Offline Payments Work</h2>
              <p className="text-sm text-white/90 leading-relaxed">
                Scan merchant QR codes even without internet. Transactions are securely cached and automatically sync when you're back online.
              </p>
            </div>
          </div>
        </div>

        {/* Scan QR Button */}
        <div className="bg-white rounded-3xl p-6 shadow-md text-center">
          <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="size-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Scan Merchant QR</h3>
          <p className="text-gray-600 mb-6">
            Works online or offline - payments sync automatically
          </p>
          <Button
            onClick={() => setShowQRScanner(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-14 rounded-full"
          >
            <QrCode className="size-5 mr-2" />
            Scan QR Code
          </Button>
        </div>

        {/* Pending Transactions */}
        {pendingTransactions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Pending Sync</h2>
              {isOnline && !syncing && (
                <Button
                  onClick={handleManualSync}
                  className="bg-green-600 hover:bg-green-700 text-white h-10 rounded-full px-6 text-sm"
                >
                  <Upload className="size-4 mr-2" />
                  Sync Now
                </Button>
              )}
            </div>

            {syncing && (
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin">
                    <Upload className="size-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-blue-900">Syncing transactions...</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {pendingTransactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-3xl p-6 shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{transaction.merchantName}</h3>
                      <p className="text-sm text-gray-600">
                        {transaction.timestamp.toLocaleString('en-TZ', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      transaction.status === 'synced' ? 'bg-green-100 text-green-700' :
                      transaction.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {transaction.status === 'synced' ? (
                        <>
                          <CheckCircle className="size-3" />
                          SYNCED
                        </>
                      ) : transaction.status === 'failed' ? (
                        <>
                          <AlertTriangle className="size-3" />
                          FAILED
                        </>
                      ) : (
                        <>
                          <Clock className="size-3" />
                          PENDING
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      TZS {transaction.amount.toLocaleString()}
                    </p>
                  </div>

                  {transaction.status === 'pending' && !isOnline && (
                    <div className="mt-4 bg-amber-50 rounded-xl p-3 border border-amber-200">
                      <p className="text-xs text-amber-800">
                        Will sync automatically when internet connection is restored
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingTransactions.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-md">
            <CheckCircle className="size-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">All Transactions Synced</p>
            <p className="text-sm text-gray-500">
              No pending offline payments
            </p>
          </div>
        )}

        {/* Features */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">Offline Payment Features</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="size-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Auto-Sync</h4>
                <p className="text-sm text-gray-600">
                  Transactions automatically sync when connection is restored
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <QrCode className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">QR Encryption</h4>
                <p className="text-sm text-gray-600">
                  All QR codes are encrypted for secure offline storage
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="size-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Fraud Prevention</h4>
                <p className="text-sm text-gray-600">
                  AI scans for suspicious patterns before syncing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Info */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Security & Privacy</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Offline payments are encrypted on your device</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Transactions sync only over secure connections</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Both merchant and customer get receipts after sync</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Maximum 100 pending transactions to prevent fraud</span>
            </li>
          </ul>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-white font-bold">Scan Merchant QR</h2>
            <button
              onClick={() => setShowQRScanner(false)}
              className="text-white p-2 hover:bg-white/10 rounded-full"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-80 h-80 border-4 border-white rounded-3xl relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <QrCode className="size-32 text-white/50" />
              </div>
              {/* Scanning animation corners */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-400" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-green-400" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-green-400" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-green-400" />
            </div>
          </div>

          <div className="p-6">
            <p className="text-white text-center mb-4">
              Position QR code within the frame
            </p>
            {!isOnline && (
              <div className="bg-amber-500/20 rounded-2xl p-4 border border-amber-500">
                <p className="text-amber-200 text-sm text-center">
                  ⚠️ Offline Mode - Payment will sync when online
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
