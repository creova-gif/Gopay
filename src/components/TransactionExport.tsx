import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, 
  Download,
  FileText,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface TransactionExportProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  timestamp: string;
  status: string;
  category?: string;
}

export function TransactionExport({ user, accessToken, onBack }: TransactionExportProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/transactions/recent`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Description', 'Amount (TZS)', 'Status', 'Category'];
    const rows = transactions.map(tx => [
      new Date(tx.timestamp).toLocaleString('en-TZ'),
      tx.type === 'credit' ? 'Credit' : 'Debit',
      tx.description,
      tx.amount.toString(),
      tx.status,
      tx.category || 'general'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goPay_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const exportToJSON = () => {
    const exportData = {
      export_date: new Date().toISOString(),
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      transactions: transactions.map(tx => ({
        id: tx.id,
        date: tx.timestamp,
        type: tx.type,
        amount: tx.amount,
        currency: 'TZS',
        description: tx.description,
        status: tx.status,
        category: tx.category || 'general',
      })),
      summary: {
        total_transactions: transactions.length,
        total_credits: transactions.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + tx.amount, 0),
        total_debits: transactions.filter(tx => tx.type === 'debit').reduce((sum, tx) => sum + tx.amount, 0),
      }
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goPay_Transactions_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else {
      exportToJSON();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalCredits = transactions.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + tx.amount, 0);
  const totalDebits = transactions.filter(tx => tx.type === 'debit').reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-4 pt-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-xl">Export Transactions</h1>
              <p className="text-blue-200 text-sm">Download your transaction history</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
            <p className="text-2xl text-gray-900">{transactions.length}</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <p className="text-xs text-green-600 mb-1">Total Credits</p>
            <p className="text-lg text-green-700">{formatCurrency(totalCredits)}</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
            <p className="text-xs text-red-600 mb-1">Total Debits</p>
            <p className="text-lg text-red-700">{formatCurrency(totalDebits)}</p>
          </div>
        </div>

        {/* Export Format Selection */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-base mb-4">Export Format</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setExportFormat('csv')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                exportFormat === 'csv'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${
                  exportFormat === 'csv' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <FileText className={`size-6 ${
                    exportFormat === 'csv' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <p className="text-sm">CSV Format</p>
                  <p className="text-xs text-gray-500">Excel compatible</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setExportFormat('json')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                exportFormat === 'json'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${
                  exportFormat === 'json' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <FileText className={`size-6 ${
                    exportFormat === 'json' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <p className="text-sm">JSON Format</p>
                  <p className="text-xs text-gray-500">Developer friendly</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={loading || transactions.length === 0}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-2xl"
        >
          <Download className="size-5 mr-2" />
          Export as {exportFormat.toUpperCase()}
        </Button>

        {/* Preview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base">Preview</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="size-4" />
              Last {transactions.length} transactions
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No transactions to export</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm">{tx.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.timestamp).toLocaleDateString('en-TZ')}
                    </p>
                  </div>
                  <div className={`text-sm ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {tx.type === 'credit' ? '+' : ''}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
              {transactions.length > 5 && (
                <p className="text-center text-xs text-gray-500 py-2">
                  +{transactions.length - 5} more transactions
                </p>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-900">Export Information</p>
              <p className="text-xs text-blue-600 mt-1">
                CSV files can be opened in Excel or Google Sheets. JSON files are compatible with accounting software and data analysis tools.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="rounded-3xl">
          <div className="py-8 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-10 text-green-600" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-2">Export Successful!</h3>
            <p className="text-gray-500">
              Your transactions have been downloaded
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}