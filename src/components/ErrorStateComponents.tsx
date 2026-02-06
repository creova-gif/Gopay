/**
 * ERROR & OFFLINE STATE COMPONENTS
 * 
 * Comprehensive error handling for:
 * - No internet connection
 * - Payment failures
 * - System delays
 * - Server errors
 * - First-time use
 * - Empty data states
 * 
 * All with clear recovery paths
 */

import {
  WifiOff,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Home,
  CheckCircle2,
  Inbox,
  Search,
  Zap
} from 'lucide-react';

// ==========================================
// OFFLINE STATE
// ==========================================
interface OfflineStateProps {
  onRetry: () => void;
  onGoHome: () => void;
}

export function OfflineState({ onRetry, onGoHome }: OfflineStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="size-24 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <WifiOff className="size-14 text-white" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">Hakuna Mtandao</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-4">No Internet Connection</h2>
        
        <p className="text-sm text-gray-700 font-medium leading-relaxed mb-8">
          Please check your internet connection and try again. Your data is safe.
        </p>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl text-base font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RefreshCw className="size-5" />
            Jaribu Tena • Try Again
          </button>

          <button
            onClick={onGoHome}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2"
          >
            <Home className="size-5" />
            Rudi Nyumbani • Go Home
          </button>
        </div>

        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <p className="text-xs text-blue-900 font-bold mb-2">💡 Tip: Offline Mode</p>
          <p className="text-xs text-blue-800 leading-relaxed">
            Some features work offline. Your recent transactions are saved locally.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAYMENT FAILED STATE
// ==========================================
interface PaymentFailedProps {
  errorMessage: string;
  transactionId?: string;
  onRetry: () => void;
  onContactSupport: () => void;
  onGoHome: () => void;
}

export function PaymentFailed({ 
  errorMessage, 
  transactionId, 
  onRetry, 
  onContactSupport,
  onGoHome 
}: PaymentFailedProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="size-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <XCircle className="size-14 text-white" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">Malipo Yameshindwa</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Failed</h2>
        
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-red-900 font-bold mb-2">Error Details:</p>
          <p className="text-sm text-red-800 leading-relaxed">{errorMessage}</p>
          {transactionId && (
            <p className="text-xs text-red-700 mt-2 font-mono">Ref: {transactionId}</p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl text-base font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RefreshCw className="size-5" />
            Try Again
          </button>

          <button
            onClick={onContactSupport}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-4 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2"
          >
            Contact Support
          </button>

          <button
            onClick={onGoHome}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl text-sm font-bold transition-all"
          >
            Go Home
          </button>
        </div>

        <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
          <p className="text-xs text-amber-900 font-bold mb-1">Don't worry!</p>
          <p className="text-xs text-amber-800 leading-relaxed">
            No money was deducted from your account. You can try again safely.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SYSTEM DELAY / PENDING STATE
// ==========================================
interface SystemDelayProps {
  message: string;
  estimatedTime?: string;
  onCheckStatus: () => void;
  onGoHome: () => void;
}

export function SystemDelay({ 
  message, 
  estimatedTime = '5-10 minutes',
  onCheckStatus,
  onGoHome 
}: SystemDelayProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="size-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
          <Clock className="size-14 text-white" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">Inaendelea...</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Processing</h2>
        
        <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6">
          {message}
        </p>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-amber-900 font-bold mb-1">Estimated Time</p>
          <p className="text-lg text-amber-900 font-black">{estimatedTime}</p>
          <p className="text-xs text-amber-800 mt-2">
            We'll notify you when it's complete
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onCheckStatus}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 rounded-xl text-base font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RefreshCw className="size-5" />
            Check Status
          </button>

          <button
            onClick={onGoHome}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl text-sm font-bold transition-all"
          >
            Go Home (Safe to leave)
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FIRST TIME USE / ONBOARDING EMPTY STATE
// ==========================================
interface FirstTimeEmptyProps {
  featureName: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ReactNode;
}

export function FirstTimeEmpty({ 
  featureName, 
  description, 
  actionLabel, 
  onAction,
  icon 
}: FirstTimeEmptyProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="size-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          {icon || <Zap className="size-10 text-white" />}
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-2">Karibu! Welcome!</h2>
        <h3 className="text-lg font-bold text-gray-900 mb-4">{featureName}</h3>
        
        <p className="text-sm text-gray-700 font-medium leading-relaxed mb-8">
          {description}
        </p>

        <button
          onClick={onAction}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl text-base font-bold transition-all shadow-lg"
        >
          {actionLabel}
        </button>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-emerald-50 rounded-xl p-3">
            <CheckCircle2 className="size-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-gray-900 font-bold">Secure</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <Zap className="size-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-900 font-bold">Fast</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3">
            <CheckCircle2 className="size-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-gray-900 font-bold">Easy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// NO RESULTS / EMPTY SEARCH
// ==========================================
interface NoResultsProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  suggestions?: string[];
}

export function NoResults({ searchQuery, onClearSearch, suggestions }: NoResultsProps) {
  return (
    <div className="min-h-[40vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="size-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Search className="size-10 text-white" />
        </div>

        <h3 className="text-lg font-black text-gray-900 mb-2">Hakuna Matokeo</h3>
        <h4 className="text-base font-bold text-gray-900 mb-4">No Results Found</h4>
        
        {searchQuery && (
          <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6">
            No results for "<span className="font-bold">{searchQuery}</span>"
          </p>
        )}

        {suggestions && suggestions.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-700 font-bold mb-3">Try searching for:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {}}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-full text-xs font-bold transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-6 py-3 rounded-xl text-sm font-bold transition-all"
          >
            Clear Search
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// EMPTY DATA STATE (Generic)
// ==========================================
interface EmptyDataProps {
  icon: React.ReactNode;
  title: string;
  swahiliTitle?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyData({ 
  icon, 
  title, 
  swahiliTitle,
  message, 
  actionLabel, 
  onAction 
}: EmptyDataProps) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="size-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          {icon}
        </div>

        {swahiliTitle && (
          <h3 className="text-lg font-bold text-gray-900 mb-1">{swahiliTitle}</h3>
        )}
        <h4 className="text-base font-black text-gray-900 mb-4">{title}</h4>
        
        <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6">
          {message}
        </p>

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// SERVER ERROR (500)
// ==========================================
interface ServerErrorProps {
  onRetry: () => void;
  onContactSupport: () => void;
}

export function ServerError({ onRetry, onContactSupport }: ServerErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="size-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <AlertTriangle className="size-14 text-white" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">Hitilafu ya Mfumo</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Error</h2>
        
        <p className="text-sm text-gray-700 font-medium leading-relaxed mb-8">
          Something went wrong on our end. Our team has been notified and is working on a fix.
        </p>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl text-base font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RefreshCw className="size-5" />
            Try Again
          </button>

          <button
            onClick={onContactSupport}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-4 rounded-xl text-base font-bold transition-all"
          >
            Contact Support
          </button>
        </div>

        <div className="mt-8 bg-gray-100 rounded-2xl p-4">
          <p className="text-xs text-gray-700 font-medium">
            Error Code: 500 • {new Date().toISOString()}
          </p>
        </div>
      </div>
    </div>
  );
}
