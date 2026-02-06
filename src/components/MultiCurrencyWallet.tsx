import { useState } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Globe, TrendingUp, RefreshCw, ArrowRightLeft,
  Plus, DollarSign, Euro, PoundSterling, Wallet, 
  Clock, Lock, ChevronRight, Check, AlertCircle, Info, Zap
} from 'lucide-react';

interface MultiCurrencyWalletProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface CurrencyBalance {
  code: string;
  name: string;
  flag: string;
  balance: number;
  rate: number; // Rate to TZS
  icon: any;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  trend: 'up' | 'down';
  change: number;
}

export function MultiCurrencyWallet({ user, accessToken, onBack }: MultiCurrencyWalletProps) {
  const [view, setView] = useState<'overview' | 'add-currency' | 'convert' | 'rates'>('overview');
  const [selectedFromCurrency, setSelectedFromCurrency] = useState('TZS');
  const [selectedToCurrency, setSelectedToCurrency] = useState('USD');
  const [convertAmount, setConvertAmount] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);

  const [balances, setBalances] = useState<CurrencyBalance[]>([
    {
      code: 'TZS',
      name: 'Tanzanian Shilling',
      flag: '🇹🇿',
      balance: 1250000,
      rate: 1,
      icon: Wallet,
    },
    {
      code: 'USD',
      name: 'US Dollar',
      flag: '🇺🇸',
      balance: 250,
      rate: 2450,
      icon: DollarSign,
    },
    {
      code: 'EUR',
      name: 'Euro',
      flag: '🇪🇺',
      balance: 180,
      rate: 2680,
      icon: Euro,
    },
  ]);

  const availableCurrencies = [
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: 3100, icon: PoundSterling },
    { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪', rate: 18.5, icon: Wallet },
    { code: 'UGX', name: 'Ugandan Shilling', flag: '🇺🇬', rate: 0.65, icon: Wallet },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦', rate: 135, icon: Wallet },
  ];

  const exchangeRates: ExchangeRate[] = [
    { from: 'USD', to: 'TZS', rate: 2450, trend: 'up', change: 0.5 },
    { from: 'EUR', to: 'TZS', rate: 2680, trend: 'down', change: -0.3 },
    { from: 'GBP', to: 'TZS', rate: 3100, trend: 'up', change: 0.8 },
    { from: 'KES', to: 'TZS', rate: 18.5, trend: 'up', change: 0.2 },
  ];

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      TZS: 'TZS',
      USD: '$',
      EUR: '€',
      GBP: '£',
      KES: 'KSh',
      UGX: 'UGX',
      ZAR: 'R',
    };

    return `${symbols[currency] || currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculateConversion = () => {
    const amount = parseFloat(convertAmount) || 0;
    const fromBalance = balances.find(b => b.code === selectedFromCurrency);
    const toBalance = balances.find(b => b.code === selectedToCurrency);
    
    if (!fromBalance || !toBalance) return 0;

    // Convert to TZS first, then to target currency
    const inTZS = amount * fromBalance.rate;
    const converted = inTZS / toBalance.rate;
    
    return converted;
  };

  const getTotalInTZS = () => {
    return balances.reduce((total, currency) => {
      return total + (currency.balance * currency.rate);
    }, 0);
  };

  const handleConvert = async () => {
    if (!convertAmount || pin.length !== 4) {
      alert('Please complete all fields');
      return;
    }

    const amount = parseFloat(convertAmount);
    const fromBalance = balances.find(b => b.code === selectedFromCurrency);
    
    if (!fromBalance || amount > fromBalance.balance) {
      alert('Insufficient balance');
      return;
    }

    setProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const converted = calculateConversion();
      
      setBalances(balances.map(b => {
        if (b.code === selectedFromCurrency) {
          return { ...b, balance: b.balance - amount };
        }
        if (b.code === selectedToCurrency) {
          return { ...b, balance: b.balance + converted };
        }
        return b;
      }));

      alert(`✅ Converted ${formatCurrency(amount, selectedFromCurrency)} to ${formatCurrency(converted, selectedToCurrency)}`);
      setConvertAmount('');
      setPin('');
      setView('overview');
      setProcessing(false);
    }, 1500);
  };

  const addCurrency = (currencyCode: string) => {
    const currency = availableCurrencies.find(c => c.code === currencyCode);
    if (!currency) return;

    const newBalance: CurrencyBalance = {
      code: currency.code,
      name: currency.name,
      flag: currency.flag,
      balance: 0,
      rate: currency.rate,
      icon: currency.icon,
    };

    setBalances([...balances, newBalance]);
    setView('overview');
    alert(`${currency.name} wallet added! 🎉`);
  };

  // Overview
  if (view === 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <ArrowLeft className="size-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold">Multi-Currency Wallet 🌍</h1>
                <p className="text-sm text-gray-500">Hold & exchange globally</p>
              </div>
            </div>
            <button
              onClick={() => setView('add-currency')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="size-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Total Portfolio */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Globe className="size-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/80">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-[rgb(246,249,255)]">{formatCurrency(getTotalInTZS(), 'TZS')}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-white/90">Holding {balances.length} currencies</span>
              <div className="flex items-center gap-1 text-green-300">
                <TrendingUp className="size-4" />
                <span className="text-sm font-semibold">+2.5%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setView('convert')}
              className="bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-emerald-500 transition-all"
            >
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <ArrowRightLeft className="size-6 text-emerald-600" />
              </div>
              <p className="font-bold">Convert</p>
              <p className="text-xs text-gray-500">Exchange currency</p>
            </button>
            <button
              onClick={() => setView('rates')}
              className="bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-emerald-500 transition-all"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="size-6 text-blue-600" />
              </div>
              <p className="font-bold">Live Rates</p>
              <p className="text-xs text-gray-500">Check exchange rates</p>
            </button>
          </div>

          {/* Currency Balances */}
          <div>
            <h3 className="font-bold mb-3">Your Currency Wallets</h3>
            <div className="space-y-3">
              {balances.map((currency) => {
                const Icon = currency.icon;
                return (
                  <div key={currency.code} className="bg-white rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{currency.flag}</div>
                        <div>
                          <p className="font-bold">{currency.code}</p>
                          <p className="text-xs text-gray-500">{currency.name}</p>
                        </div>
                      </div>
                      <Icon className="size-5 text-gray-400" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold">{formatCurrency(currency.balance, currency.code)}</p>
                        <p className="text-xs text-gray-500">≈ {formatCurrency(currency.balance * currency.rate, 'TZS')}</p>
                      </div>
                      <button className="text-emerald-600 text-sm font-semibold hover:underline">
                        Top Up
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="font-bold mb-3">Why Multi-Currency?</h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Cheap FX rates (better than banks)</p>
              </div>
              <div className="flex gap-2">
                <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Hold money before traveling</p>
              </div>
              <div className="flex gap-2">
                <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Protect from TZS fluctuations</p>
              </div>
              <div className="flex gap-2">
                <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Pay internationally with virtual cards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add Currency View
  if (view === 'add-currency') {
    const available = availableCurrencies.filter(c => !balances.find(b => b.code === c.code));

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('overview')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold">Add Currency Wallet</h1>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {available.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">You've added all available currencies! 🎉</p>
            </div>
          ) : (
            available.map((currency) => {
              const Icon = currency.icon;
              return (
                <button
                  key={currency.code}
                  onClick={() => addCurrency(currency.code)}
                  className="w-full bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-emerald-500 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{currency.flag}</div>
                      <div>
                        <p className="font-bold">{currency.code}</p>
                        <p className="text-sm text-gray-500">{currency.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">1 {currency.code} =</p>
                      <p className="font-semibold">{currency.rate} TZS</p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // Convert View
  if (view === 'convert') {
    const fromBalance = balances.find(b => b.code === selectedFromCurrency);
    const amount = parseFloat(convertAmount) || 0;
    const converted = calculateConversion();
    const fee = amount * 0.005; // 0.5% fee

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('overview')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold">Convert Currency</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* From Currency */}
          <div className="bg-white rounded-2xl p-4">
            <label className="block text-sm font-semibold mb-2">From</label>
            <select
              value={selectedFromCurrency}
              onChange={(e) => setSelectedFromCurrency(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none mb-3"
            >
              {balances.map(b => (
                <option key={b.code} value={b.code}>
                  {b.flag} {b.code} - {formatCurrency(b.balance, b.code)}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="0.00"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-2xl font-bold"
            />
            {fromBalance && (
              <p className="text-xs text-gray-500 mt-2">
                Available: {formatCurrency(fromBalance.balance, selectedFromCurrency)}
              </p>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                const temp = selectedFromCurrency;
                setSelectedFromCurrency(selectedToCurrency);
                setSelectedToCurrency(temp);
              }}
              className="bg-emerald-100 p-3 rounded-full hover:bg-emerald-200 transition-all"
            >
              <RefreshCw className="size-6 text-emerald-600" />
            </button>
          </div>

          {/* To Currency */}
          <div className="bg-white rounded-2xl p-4">
            <label className="block text-sm font-semibold mb-2">To</label>
            <select
              value={selectedToCurrency}
              onChange={(e) => setSelectedToCurrency(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none mb-3"
            >
              {balances.map(b => (
                <option key={b.code} value={b.code}>
                  {b.flag} {b.code}
                </option>
              ))}
            </select>
            <div className="bg-gray-50 h-14 px-4 rounded-xl flex items-center">
              <p className="text-2xl font-bold text-gray-700">
                {amount > 0 ? formatCurrency(converted, selectedToCurrency) : '0.00'}
              </p>
            </div>
          </div>

          {/* Rate Info */}
          {amount > 0 && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Exchange Rate:</span>
                <span className="font-bold">
                  1 {selectedFromCurrency} = {(converted / amount).toFixed(4)} {selectedToCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Fee (0.5%):</span>
                <span className="font-semibold">{formatCurrency(fee, selectedFromCurrency)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-white/70">
                <Zap className="size-3" />
                <span>Better than bank rates by ~3%</span>
              </div>
            </div>
          )}

          {/* PIN */}
          <div className="bg-white rounded-2xl p-4">
            <label className="block font-bold mb-2">Enter PIN</label>
            <input
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleConvert}
            disabled={processing || !convertAmount || pin.length !== 4 || amount <= 0}
            className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {processing ? 'Converting...' : 'Convert Now'}
          </Button>
        </div>
      </div>
    );
  }

  // Rates View
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('overview')} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="size-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Live Exchange Rates</h1>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="size-3" />
              <span>Updated 2 minutes ago</span>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <RefreshCw className="size-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {exchangeRates.map((rate, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="font-bold text-lg">{rate.from}/{rate.to}</p>
                <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                  rate.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <TrendingUp className={`size-3 ${rate.trend === 'down' && 'rotate-180'}`} />
                  <span>{rate.change > 0 ? '+' : ''}{rate.change}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold">{rate.rate}</p>
            </div>
            <p className="text-xs text-gray-500">
              1 {rate.from} = {rate.rate} {rate.to}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
