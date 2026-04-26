import { useState, useEffect } from 'react';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import { useAnalytics } from '../hooks/useAnalytics';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User } from '../App';
import { 
  ArrowLeft, Zap, Droplet, Phone, Building2, GraduationCap,
  Tv, ChevronRight, Check, CreditCard, Shield, AlertCircle,
  Search, Star, Clock, Wallet, Smartphone, History, Plus,
  Calendar, Bell, Save, X, Info, Receipt, Download, LucideIcon, RefreshCw
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface BillPaymentsPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
  onNavigate?: (page: 'recurringpayments') => void;
}

type BillCategory = 'electricity' | 'water' | 'phone' | 'government' | 'education' | 'tv';
type PaymentMethod = 'gopay' | 'card' | 'mpesa' | 'tigopesa' | 'airtelmoney' | 'halopesa' | 'ezypesa' | 'crdb' | 'nmb' | 'nbc' | 'equity' | 'stanbic';

interface SavedBiller {
  id: string;
  provider: string;
  accountNumber: string;
  nickname: string;
  icon: LucideIcon;
  iconColor: string;
  lastAmount: number;
  category: BillCategory;
}

interface RecentPayment {
  id: string;
  provider: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
  icon: LucideIcon;
  iconColor: string;
  accountNumber: string;
}

interface ServiceProvider {
  id: string;
  name: string;
  category: BillCategory;
  icon: LucideIcon;
  iconColor: string;
  popular?: boolean;
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
  }[];
}

export function BillPaymentsPage({ user, accessToken, onBack, onNavigate }: BillPaymentsPageProps) {
  const { isOnline, enqueue } = useOfflineQueue();
  const { track } = useAnalytics(accessToken);
  const [activeView, setActiveView] = useState<'home' | 'category' | 'provider' | 'payment' | 'confirm' | 'success'>('home');
  const [selectedCategory, setSelectedCategory] = useState<BillCategory | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gopay');
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);
  const [nickname, setNickname] = useState('');
  const [schedulePayment, setSchedulePayment] = useState(false);
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [balance, setBalance] = useState(450000);

  const categories = [
    { id: 'electricity', name: 'Electricity', icon: Zap, color: 'bg-yellow-500', count: 8 },
    { id: 'water', name: 'Water', icon: Droplet, color: 'bg-blue-500', count: 12 },
    { id: 'phone', name: 'Mobile & Internet', icon: Phone, color: 'bg-green-500', count: 10 },
    { id: 'tv', name: 'TV & Entertainment', icon: Tv, color: 'bg-purple-500', count: 6 },
    { id: 'government', name: 'Government Services', icon: Building2, color: 'bg-red-500', count: 8 },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'bg-indigo-500', count: 5 },
  ];

  const savedBillers: SavedBiller[] = [
    { id: '1', provider: 'TANESCO LUKU', accountNumber: '1234567890', nickname: 'Home', icon: Zap, iconColor: 'text-yellow-500', lastAmount: 45000, category: 'electricity' },
    { id: '2', provider: 'DAWASA', accountNumber: '9876543210', nickname: 'Apartment', icon: Droplet, iconColor: 'text-blue-500', lastAmount: 28000, category: 'water' },
    { id: '3', provider: 'Vodacom Postpaid', accountNumber: '+255712345678', nickname: 'My Number', icon: Smartphone, iconColor: 'text-green-500', lastAmount: 35000, category: 'phone' },
  ];

  const recentPayments: RecentPayment[] = [
    { id: '1', provider: 'TANESCO LUKU', amount: 45000, date: '2024-01-15', status: 'success', icon: Zap, iconColor: 'text-yellow-500', accountNumber: '1234567890' },
    { id: '2', provider: 'DStv Premium', amount: 95000, date: '2024-01-14', status: 'success', icon: Tv, iconColor: 'text-purple-500', accountNumber: '4567891230' },
    { id: '3', provider: 'Vodacom Postpaid', amount: 35000, date: '2024-01-12', status: 'success', icon: Smartphone, iconColor: 'text-green-500', accountNumber: '+255712345678' },
  ];

  const popularProviders: ServiceProvider[] = [
    {
      id: 'tanesco-luku',
      name: 'TANESCO LUKU',
      category: 'electricity',
      icon: Zap,
      iconColor: 'text-yellow-500',
      popular: true,
      fields: [
        { name: 'meterNumber', label: 'Meter Number', type: 'text', placeholder: '10-digit meter number', required: true },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+255 7XX XXX XXX', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Minimum 1,000', required: true }
      ]
    },
    {
      id: 'dawasa',
      name: 'DAWASA',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      popular: true,
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'vodacom-postpaid',
      name: 'Vodacom Postpaid',
      category: 'phone',
      icon: Smartphone,
      iconColor: 'text-green-500',
      popular: true,
      fields: [
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+255 7XX XXX XXX', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'dstv',
      name: 'DStv',
      category: 'tv',
      icon: Tv,
      iconColor: 'text-purple-500',
      popular: true,
      fields: [
        { name: 'smartcardNumber', label: 'Smartcard Number', type: 'text', placeholder: '10-digit number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
  ];

  // ALL SERVICE PROVIDERS - Comprehensive Tanzania coverage
  const allProviders: ServiceProvider[] = [
    // ELECTRICITY PROVIDERS (All Tanzania)
    {
      id: 'tanesco-luku',
      name: 'TANESCO LUKU (Prepaid)',
      category: 'electricity',
      icon: Zap,
      iconColor: 'text-yellow-500',
      popular: true,
      fields: [
        { name: 'meterNumber', label: 'Meter Number', type: 'text', placeholder: '10-digit meter number', required: true },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+255 7XX XXX XXX', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Minimum 1,000', required: true }
      ]
    },
    {
      id: 'tanesco-postpaid',
      name: 'TANESCO (Postpaid)',
      category: 'electricity',
      icon: Zap,
      iconColor: 'text-yellow-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'tanesco-dar',
      name: 'TANESCO Dar es Salaam',
      category: 'electricity',
      icon: Zap,
      iconColor: 'text-yellow-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'tanesco-arusha',
      name: 'TANESCO Arusha Region',
      category: 'electricity',
      icon: Zap,
      iconColor: 'text-yellow-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'tanesco-mwanza',
      name: 'TANESCO Mwanza Region',
      category: 'electricity',
      icon: Zap,
      iconColor: 'text-yellow-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'tanesco-dodoma',
      name: 'TANESCO Dodoma Region',
      category: 'electricity',
      icon: Zap,
      iconColor: 'text-yellow-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'tanesco-mbeya',
      name: 'TANESCO Mbeya Region',
      category: 'electricity',
      icon: Zap,
      iconColor: 'text-yellow-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'tanesco-zanzibar',
      name: 'ZECO (Zanzibar Electricity)',
      category: 'electricity',
      icon: Zap,
      iconColor: 'text-yellow-500',
      fields: [
        { name: 'meterNumber', label: 'Meter Number', type: 'text', placeholder: 'Meter number', required: true },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+255 7XX XXX XXX', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },

    // WATER PROVIDERS (Regional)
    {
      id: 'dawasa',
      name: 'DAWASA (Dar es Salaam)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      popular: true,
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'auwsa',
      name: 'AUWSA (Arusha)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'mwauwsa',
      name: 'MWAUWSA (Mwanza)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'duwasa',
      name: 'DUWASA (Dodoma)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'muwsa',
      name: 'MUWSA (Mbeya)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'moruwasa',
      name: 'MORUWASA (Morogoro)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'tuwasa',
      name: 'TUWASA (Tanga)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'iruwasa',
      name: 'IRUWASA (Iringa)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'zawa',
      name: 'ZAWA (Zanzibar Water)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'shuwasa',
      name: 'SHUWASA (Shinyanga)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'kuwasa',
      name: 'KUWASA (Kagera)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'ruwasa',
      name: 'RUWASA (Rukwa)',
      category: 'water',
      icon: Droplet,
      iconColor: 'text-blue-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },

    // MOBILE & INTERNET (Nationwide)
    {
      id: 'vodacom-postpaid',
      name: 'Vodacom Postpaid',
      category: 'phone',
      icon: Smartphone,
      iconColor: 'text-green-500',
      popular: true,
      fields: [
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+255 7XX XXX XXX', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'airtel-postpaid',
      name: 'Airtel Postpaid',
      category: 'phone',
      icon: Smartphone,
      iconColor: 'text-green-500',
      fields: [
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+255 7XX XXX XXX', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'tigo-postpaid',
      name: 'Tigo Postpaid',
      category: 'phone',
      icon: Smartphone,
      iconColor: 'text-green-500',
      fields: [
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+255 7XX XXX XXX', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'halotel-postpaid',
      name: 'Halotel Postpaid',
      category: 'phone',
      icon: Smartphone,
      iconColor: 'text-green-500',
      fields: [
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+255 7XX XXX XXX', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'ttcl-internet',
      name: 'TTCL Internet',
      category: 'phone',
      icon: Smartphone,
      iconColor: 'text-green-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'ttcl-landline',
      name: 'TTCL Landline',
      category: 'phone',
      icon: Smartphone,
      iconColor: 'text-green-500',
      fields: [
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+255 2X XXX XXXX', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'smile-internet',
      name: 'Smile Internet',
      category: 'phone',
      icon: Smartphone,
      iconColor: 'text-green-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'raha-internet',
      name: 'Raha Internet',
      category: 'phone',
      icon: Smartphone,
      iconColor: 'text-green-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'zte-internet',
      name: 'ZTE Internet',
      category: 'phone',
      icon: Smartphone,
      iconColor: 'text-green-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'zantel-postpaid',
      name: 'Zantel Postpaid (Zanzibar)',
      category: 'phone',
      icon: Smartphone,
      iconColor: 'text-green-500',
      fields: [
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+255 77X XXX XXX', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },

    // TV & ENTERTAINMENT (Nationwide)
    {
      id: 'dstv',
      name: 'DStv',
      category: 'tv',
      icon: Tv,
      iconColor: 'text-purple-500',
      popular: true,
      fields: [
        { name: 'smartcardNumber', label: 'Smartcard Number', type: 'text', placeholder: '10-digit number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'gotv',
      name: 'GOtv',
      category: 'tv',
      icon: Tv,
      iconColor: 'text-purple-500',
      fields: [
        { name: 'iucNumber', label: 'IUC Number', type: 'text', placeholder: 'IUC number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'startimes',
      name: 'StarTimes',
      category: 'tv',
      icon: Tv,
      iconColor: 'text-purple-500',
      fields: [
        { name: 'smartcardNumber', label: 'Smartcard Number', type: 'text', placeholder: 'Smartcard number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'azam-tv',
      name: 'Azam TV',
      category: 'tv',
      icon: Tv,
      iconColor: 'text-purple-500',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Account number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'netflix',
      name: 'Netflix',
      category: 'tv',
      icon: Tv,
      iconColor: 'text-purple-500',
      fields: [
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Your Netflix email', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'showmax',
      name: 'Showmax',
      category: 'tv',
      icon: Tv,
      iconColor: 'text-purple-500',
      fields: [
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Your Showmax email', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },

    // GOVERNMENT SERVICES (Nationwide)
    {
      id: 'tra-income-tax',
      name: 'TRA - Income Tax',
      category: 'government',
      icon: Building2,
      iconColor: 'text-red-500',
      fields: [
        { name: 'tin', label: 'TIN Number', type: 'text', placeholder: '9-digit TIN', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'tra-vat',
      name: 'TRA - VAT',
      category: 'government',
      icon: Building2,
      iconColor: 'text-red-500',
      fields: [
        { name: 'tin', label: 'TIN Number', type: 'text', placeholder: '9-digit TIN', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'tra-paye',
      name: 'TRA - PAYE',
      category: 'government',
      icon: Building2,
      iconColor: 'text-red-500',
      fields: [
        { name: 'tin', label: 'TIN Number', type: 'text', placeholder: '9-digit TIN', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'lga-dar',
      name: 'Dar es Salaam City License',
      category: 'government',
      icon: Building2,
      iconColor: 'text-red-500',
      fields: [
        { name: 'licenseNumber', label: 'License Number', type: 'text', placeholder: 'License number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'lga-arusha',
      name: 'Arusha City License',
      category: 'government',
      icon: Building2,
      iconColor: 'text-red-500',
      fields: [
        { name: 'licenseNumber', label: 'License Number', type: 'text', placeholder: 'License number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'lga-mwanza',
      name: 'Mwanza City License',
      category: 'government',
      icon: Building2,
      iconColor: 'text-red-500',
      fields: [
        { name: 'licenseNumber', label: 'License Number', type: 'text', placeholder: 'License number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'nida',
      name: 'NIDA Services',
      category: 'government',
      icon: Building2,
      iconColor: 'text-red-500',
      fields: [
        { name: 'nidaNumber', label: 'NIDA Number', type: 'text', placeholder: 'NIDA number', required: true },
        { name: 'serviceType', label: 'Service Type', type: 'text', placeholder: 'e.g., ID Card, Passport', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'traffic-fines',
      name: 'Traffic Fines',
      category: 'government',
      icon: Building2,
      iconColor: 'text-red-500',
      fields: [
        { name: 'ticketNumber', label: 'Ticket Number', type: 'text', placeholder: 'Ticket number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },

    // EDUCATION (Nationwide)
    {
      id: 'udsm',
      name: 'University of Dar es Salaam',
      category: 'education',
      icon: GraduationCap,
      iconColor: 'text-indigo-500',
      fields: [
        { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Student registration number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'udsm-tuition',
      name: 'UDSM - Tuition Fee',
      category: 'education',
      icon: GraduationCap,
      iconColor: 'text-indigo-500',
      fields: [
        { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Student registration number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'out',
      name: 'Open University of Tanzania',
      category: 'education',
      icon: GraduationCap,
      iconColor: 'text-indigo-500',
      fields: [
        { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Student registration number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'sua',
      name: 'Sokoine University (SUA)',
      category: 'education',
      icon: GraduationCap,
      iconColor: 'text-indigo-500',
      fields: [
        { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Student registration number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
    {
      id: 'tcaa',
      name: 'Tanzania Civil Aviation (TCAA)',
      category: 'education',
      icon: GraduationCap,
      iconColor: 'text-indigo-500',
      fields: [
        { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Student registration number', required: true },
        { name: 'amount', label: 'Amount (TZS)', type: 'number', placeholder: 'Enter amount', required: true }
      ]
    },
  ];

  const paymentMethods = [
    { id: 'gopay', name: 'goPay Wallet', icon: Wallet, balance: balance, color: 'text-green-600' },
    { id: 'card', name: 'Debit/Credit Card', icon: CreditCard, balance: null, color: 'text-blue-600' },
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, balance: null, color: 'text-green-600' },
    { id: 'tigopesa', name: 'Tigo Pesa', icon: Smartphone, balance: null, color: 'text-blue-600' },
    { id: 'airtelmoney', name: 'Airtel Money', icon: Smartphone, balance: null, color: 'text-red-600' },
    { id: 'halopesa', name: 'Halopesa', icon: Smartphone, balance: null, color: 'text-green-600' },
    { id: 'ezypesa', name: 'EzyPesa', icon: Smartphone, balance: null, color: 'text-blue-600' },
    { id: 'crdb', name: 'CRDB', icon: CreditCard, balance: null, color: 'text-red-600' },
    { id: 'nmb', name: 'NMB', icon: CreditCard, balance: null, color: 'text-blue-600' },
    { id: 'nbc', name: 'NBC', icon: CreditCard, balance: null, color: 'text-green-600' },
    { id: 'equity', name: 'Equity', icon: CreditCard, balance: null, color: 'text-blue-600' },
    { id: 'stanbic', name: 'Stanbic', icon: CreditCard, balance: null, color: 'text-red-600' },
  ];

  // Helper function to initialize form data for a provider
  const initializeFormData = (provider: ServiceProvider, initialValues: Record<string, string> = {}) => {
    const initialData: Record<string, string> = {};
    provider.fields.forEach(field => {
      initialData[field.name] = initialValues[field.name] || '';
    });
    return initialData;
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/balance`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate fees: 15% commission + payment method fees
  const calculateFees = (billAmount: number, method: PaymentMethod) => {
    const commission = Math.round(billAmount * 0.15); // Your 15% profit
    
    // Payment method processing fees
    let processingFee = 0;
    if (method === 'card') {
      processingFee = Math.round(billAmount * 0.025); // 2.5% for cards
    } else if (['mpesa', 'tigopesa', 'airtelmoney', 'halopesa', 'ezypesa'].includes(method)) {
      processingFee = Math.round(billAmount * 0.01); // 1% for mobile money
    } else if (['crdb', 'nmb', 'nbc', 'equity', 'stanbic'].includes(method)) {
      processingFee = Math.round(billAmount * 0.015); // 1.5% for bank transfers
    }
    // goPay wallet has 0% processing fee
    
    const totalFees = commission + processingFee;
    const totalAmount = billAmount + totalFees;
    
    return {
      billAmount,
      commission,
      processingFee,
      totalFees,
      totalAmount
    };
  };

  const handlePaymentSubmit = async () => {
    const payload = {
      provider: selectedProvider?.id,
      formData,
      amount: parseInt(amount),
      paymentMethod,
      pin,
      saveAsFavorite,
      nickname: saveAsFavorite ? nickname : undefined,
      schedulePayment,
    };
    const endpoint = `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/bills/pay`;

    track('bill_payment_started', { provider: selectedProvider?.id, amount: parseInt(amount), paymentMethod });

    if (!isOnline) {
      await enqueue({ type: 'bill', payload, endpoint, accessToken });
      track('bill_payment_queued_offline', { provider: selectedProvider?.id, amount: parseInt(amount) });
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setActiveView('success');
        track('bill_payment_completed', { provider: selectedProvider?.id, amount: parseInt(amount), paymentMethod });
        if (paymentMethod === 'gopay') fetchBalance();
      } else {
        toast.error('Malipo yameshindwa. Jaribu tena.');
      }
    } catch {
      await enqueue({ type: 'bill', payload, endpoint, accessToken });
      track('bill_payment_queued_offline', { provider: selectedProvider?.id, amount: parseInt(amount) });
    } finally {
      setProcessing(false);
    }
  };

  const repeatPayment = (payment: RecentPayment) => {
    const provider = popularProviders.find(p => p.name === payment.provider);
    if (provider) {
      setSelectedProvider(provider);
      setFormData(initializeFormData(provider, { accountNumber: payment.accountNumber }));
      setAmount(payment.amount.toString());
      setActiveView('payment');
    }
  };

  const payFavorite = (biller: SavedBiller) => {
    const provider = popularProviders.find(p => p.name === biller.provider);
    if (provider) {
      setSelectedProvider(provider);
      const firstFieldName = provider.fields[0]?.name || '';
      setFormData(initializeFormData(provider, { [firstFieldName]: biller.accountNumber }));
      setAmount(biller.lastAmount.toString());
      setActiveView('payment');
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    if (method === 'gopay') return <Wallet className="size-5" />;
    if (method === 'card') return <CreditCard className="size-5" />;
    if (['mpesa', 'tigopesa', 'airtelmoney', 'halopesa', 'ezypesa'].includes(method)) {
      return <Smartphone className="size-5" />;
    }
    if (['crdb', 'nmb', 'nbc', 'equity', 'stanbic'].includes(method)) {
      return <Building2 className="size-5" />;
    }
    return <Wallet className="size-5" />;
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    if (method === 'gopay') return 'goPay Wallet';
    if (method === 'card') return 'Debit/Credit Card';
    if (method === 'mpesa') return 'M-Pesa';
    if (method === 'tigopesa') return 'Tigo Pesa';
    if (method === 'airtelmoney') return 'Airtel Money';
    if (method === 'halopesa') return 'Halopesa';
    if (method === 'ezypesa') return 'EzyPesa';
    if (method === 'crdb') return 'CRDB Bank';
    if (method === 'nmb') return 'NMB Bank';
    if (method === 'nbc') return 'NBC Bank';
    if (method === 'equity') return 'Equity Bank';
    if (method === 'stanbic') return 'Stanbic Bank';
    return method;
  };

  // HOME VIEW - Main Bill Payments Screen
  // Category accent palette for dark theme
  const CAT_META: Record<string, { accent: string; bg: string; border: string; gradient: string }> = {
    electricity: { accent: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.18)', gradient: 'linear-gradient(135deg,#422006 0%,#92400e 60%,#b45309 100%)' },
    water:       { accent: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.18)', gradient: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 60%,#1d4ed8 100%)' },
    phone:       { accent: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.18)', gradient: 'linear-gradient(135deg,#052e16 0%,#14532d 60%,#166534 100%)' },
    tv:          { accent: '#c4b5fd', bg: 'rgba(196,181,253,0.08)', border: 'rgba(196,181,253,0.18)',gradient: 'linear-gradient(135deg,#1a0533 0%,#4c1d95 60%,#6d28d9 100%)' },
    government:  { accent: '#fb923c', bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.18)', gradient: 'linear-gradient(135deg,#1c0a00 0%,#7c2d12 60%,#c2410c 100%)' },
    education:   { accent: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.18)',gradient: 'linear-gradient(135deg,#1e1b4b 0%,#3730a3 60%,#4338ca 100%)' },
  };

  if (activeView === 'home') {
    const filteredProviders = searchQuery.trim()
      ? allProviders.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : [];

    return (
      <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 80 }}>
        {/* ── STICKY HEADER ── */}
        <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding: '16px 16px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <button onClick={onBack} className="active:scale-95 transition-transform"
                style={{ padding: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
              </button>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>Lipa Bili</h1>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Huduma za malipo Tanzania</p>
              </div>
              {onNavigate && (
                <button onClick={() => onNavigate('recurringpayments')} className="active:scale-95 transition-transform"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 20, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', cursor: 'pointer' }}>
                  <RefreshCw style={{ width: 13, height: 13, color: '#4ade80' }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80' }}>Mara kwa Mara</span>
                </button>
              )}
            </div>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(255,255,255,0.35)' }} />
              <input type="text" placeholder="Tafuta huduma: umeme, maji, simu..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', height: 48, paddingLeft: 44, paddingRight: searchQuery ? 44 : 16, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', padding: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.6)' }} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── SEARCH RESULTS ── */}
        {searchQuery.trim() && (
          <div style={{ padding: '16px 16px 0' }}>
            {filteredProviders.length === 0
              ? <p style={{ textAlign: 'center', padding: '24px 0', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>Hakuna matokeo kwa "{searchQuery}"</p>
              : filteredProviders.map(provider => {
                  const m = CAT_META[provider.category] ?? CAT_META.electricity;
                  const Icon = provider.icon;
                  return (
                    <button key={provider.id} onClick={() => { setSelectedProvider(provider); setFormData(initializeFormData(provider)); setAmount(''); setActiveView('provider'); }}
                      className="active:scale-[0.98] transition-transform"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 8, cursor: 'pointer' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 13, background: m.bg, border: `1px solid ${m.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon style={{ width: 22, height: 22, color: m.accent }} />
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{provider.name}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{provider.category}</p>
                      </div>
                      <ChevronRight style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.25)' }} />
                    </button>
                  );
                })
            }
          </div>
        )}

        {!searchQuery.trim() && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* ── SAVED BILLERS ── */}
            {savedBillers.length > 0 && (
              <div style={{ padding: '20px 16px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Bili Zilizohifadhiwa</h2>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Lipa haraka • Saved Billers</p>
                  </div>
                  <button style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', background: 'none', border: 'none', cursor: 'pointer' }}>Simamia</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {savedBillers.map(biller => {
                    const Icon = biller.icon;
                    const catId = biller.category as string;
                    const m = CAT_META[catId] ?? CAT_META.electricity;
                    return (
                      <button key={biller.id} onClick={() => payFavorite(biller)}
                        className="active:scale-[0.98] transition-transform"
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                        {/* Accent glow */}
                        <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: '50%', background: `radial-gradient(circle, ${m.accent}12 0%, transparent 70%)` }} />
                        <div style={{ width: 52, height: 52, borderRadius: 16, background: m.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                          <Icon style={{ width: 26, height: 26, color: '#fff' }} />
                          <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#fbbf24', border: '2px solid #080d08', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Star style={{ width: 8, height: 8, color: '#fff', fill: '#fff' }} />
                          </div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: 2 }}>{biller.provider}</p>
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>{biller.nickname}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>••••{biller.accountNumber.slice(-4)}</span>
                            <span style={{ fontSize: '11px', color: m.accent, fontWeight: 700 }}>{formatCurrency(biller.lastAmount)}</span>
                          </div>
                        </div>
                        <ChevronRight style={{ width: 18, height: 18, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── RECENT PAYMENTS ── */}
            {recentPayments.length > 0 && (
              <div style={{ padding: '20px 16px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock style={{ width: 18, height: 18, color: '#60a5fa' }} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Malipo ya Hivi Karibuni</h2>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Gonga kurudia malipo</p>
                    </div>
                  </div>
                  <button style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', background: 'none', border: 'none', cursor: 'pointer' }}>Yote</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recentPayments.map(payment => {
                    const Icon = payment.icon;
                    const m = payment.iconColor.includes('yellow') ? CAT_META.electricity
                            : payment.iconColor.includes('blue') ? CAT_META.water
                            : payment.iconColor.includes('purple') ? CAT_META.tv
                            : payment.iconColor.includes('red') ? CAT_META.government
                            : payment.iconColor.includes('indigo') ? CAT_META.education
                            : CAT_META.phone;
                    const statusColor = payment.status === 'success' ? '#4ade80' : payment.status === 'pending' ? '#fbbf24' : '#f87171';
                    const statusLabel = payment.status === 'success' ? 'Imelipwa' : payment.status === 'pending' ? 'Inasubiri' : 'Imeshindwa';
                    return (
                      <button key={payment.id} onClick={() => repeatPayment(payment)}
                        className="active:scale-[0.98] transition-transform"
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon style={{ width: 22, height: 22, color: 'rgba(255,255,255,0.7)' }} />
                          </div>
                          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: statusColor, border: '2px solid #080d08', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check style={{ width: 7, height: 7, color: '#fff' }} />
                          </div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: 3 }}>{payment.provider}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{new Date(payment.date).toLocaleDateString('sw-TZ', { month: 'short', day: 'numeric' })}</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>·</span>
                            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)' }}>••••{payment.accountNumber.slice(-4)}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: 3 }}>{formatCurrency(payment.amount)}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                            <span style={{ fontSize: '11px', fontWeight: 600, color: statusColor }}>{statusLabel}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── CATEGORIES ── */}
            <div style={{ padding: '20px 16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Aina za Huduma</h2>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Chagua aina ya huduma unayohitaji</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const m = CAT_META[cat.id] ?? CAT_META.electricity;
                  return (
                    <button key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id as BillCategory); setActiveView('category'); }}
                      className="active:scale-[0.97] transition-transform text-left"
                      style={{ borderRadius: 22, padding: '20px 16px', background: m.gradient, border: `1px solid ${m.accent}25`, position: 'relative', overflow: 'hidden', boxShadow: `0 4px 20px ${m.accent}18`, cursor: 'pointer' }}>
                      {/* Corner glow */}
                      <div style={{ position: 'absolute', top: -12, right: -12, width: 60, height: 60, borderRadius: '50%', background: `radial-gradient(circle, ${m.accent}20 0%, transparent 70%)` }} />
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: `${m.accent}20`, border: `1px solid ${m.accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                          <Icon style={{ width: 24, height: 24, color: m.accent }} />
                        </div>
                        <p style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginBottom: 3 }}>{cat.name}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>{cat.count} watoa huduma</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: 3 }}>
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: `${m.accent}50` }} />
                            <div style={{ width: 18, height: 4, borderRadius: 2, background: m.accent }} />
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: `${m.accent}50` }} />
                          </div>
                          <ChevronRight style={{ width: 16, height: 16, color: `${m.accent}80` }} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── POPULAR PROVIDERS ── */}
            <div style={{ padding: '20px 16px 0' }}>
              <div style={{ marginBottom: 12 }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Watoa Huduma Maarufu</h2>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Huduma zinazotumiwa zaidi</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {popularProviders.map(provider => {
                  const Icon = provider.icon;
                  const m = CAT_META[provider.category] ?? CAT_META.electricity;
                  return (
                    <button key={provider.id}
                      onClick={() => { setSelectedProvider(provider); setFormData(initializeFormData(provider)); setAmount(''); setActiveView('provider'); }}
                      className="active:scale-95 transition-transform"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
                      <div style={{ width: 60, height: 60, borderRadius: 18, background: m.bg, border: `1px solid ${m.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon style={{ width: 26, height: 26, color: m.accent }} />
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 1.3 }}>{provider.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    );
  }

  // CATEGORY VIEW - Show providers in selected category
  if (activeView === 'category') {
    const categoryProviders = allProviders.filter(p => p.category === selectedCategory);
    const categoryData = categories.find(c => c.id === selectedCategory);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setActiveView('home')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex items-center gap-3">
                {categoryData && <categoryData.icon className="size-6 text-gray-900" />}
                <h1 className="text-xl font-bold text-gray-900">{categoryData?.name}</h1>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {categoryProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => {
                setSelectedProvider(provider);
                setFormData(initializeFormData(provider));
                setAmount('');
                setActiveView('provider');
              }}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                <provider.icon className="size-6 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                <p className="text-sm text-gray-600">Instant payment</p>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // PROVIDER VIEW - Enter bill details
  if (activeView === 'provider') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveView(selectedCategory ? 'category' : 'home')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                  {selectedProvider?.icon && <selectedProvider.icon className="size-6 text-gray-600" />}
                </div>
                <h1 className="text-xl font-bold text-gray-900">{selectedProvider?.name}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900">Enter Bill Details</h3>

            {selectedProvider?.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="h-12"
                />
              </div>
            ))}

            <div className="pt-4">
              <Button
                onClick={() => {
                  setAmount(formData.amount || '');
                  setActiveView('payment');
                }}
                className="w-full h-12 bg-green-600 hover:bg-green-700"
                disabled={!selectedProvider?.fields.every(f => !f.required || formData[f.name])}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PAYMENT VIEW - Select payment method and confirm
  if (activeView === 'payment') {
    const fees = calculateFees(parseInt(amount) || 0, paymentMethod);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveView('provider')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Payment Details</h1>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Payment Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                {selectedProvider?.icon && <selectedProvider.icon className="size-6 text-gray-500" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{selectedProvider?.name}</h3>
                <p className="text-sm text-gray-600">
                  {Object.entries(formData).find(([key]) => key !== 'amount')?.[1]}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bill Amount</span>
                <span className="font-semibold text-gray-900">{formatCurrency(fees.billAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="pt-3 border-t flex justify-between">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(fees.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const MethodIcon = getPaymentMethodIcon(method.id as PaymentMethod);
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${paymentMethod === method.id ? 'bg-green-600' : 'bg-gray-200'} w-5 h-5 rounded-full flex items-center justify-center`}>
                        {paymentMethod === method.id && <Check className="size-3 text-white" />}
                      </div>
                      <MethodIcon className={`size-5 ${method.color}`} />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{getPaymentMethodName(method.id as PaymentMethod)}</p>
                        {method.balance !== null && (
                          <p className="text-xs text-gray-600">Balance: {formatCurrency(method.balance)}</p>
                        )}
                      </div>
                      {method.id === 'card' && (
                        <button className="text-sm text-green-600 font-semibold">+ Add Card</button>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900">Options</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="size-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Save as favorite</p>
                  <p className="text-xs text-gray-600">Quick access for future payments</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={saveAsFavorite}
                onChange={(e) => setSaveAsFavorite(e.target.checked)}
                className="w-5 h-5 rounded accent-green-600"
              />
            </div>

            {saveAsFavorite && (
              <Input
                placeholder="Enter nickname (e.g., Home, Office)"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="h-12"
              />
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Schedule payment</p>
                  <p className="text-xs text-gray-600">Pay automatically every month</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={schedulePayment}
                onChange={(e) => setSchedulePayment(e.target.checked)}
                className="w-5 h-5 rounded accent-green-600"
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <Shield className="size-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Secure Payment</p>
              <p className="text-xs text-blue-700 mt-1">
                Your payment is protected with 256-bit encryption and verified by our security system.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setActiveView('confirm')}
            className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg"
          >
            Pay {formatCurrency(fees.totalAmount)}
          </Button>
        </div>
      </div>
    );
  }

  // CONFIRM VIEW - Enter PIN
  if (activeView === 'confirm') {
    const fees = calculateFees(parseInt(amount) || 0, paymentMethod);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveView('payment')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Confirm Payment</h1>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="size-8 text-green-600" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Enter Your PIN</h3>
            <p className="text-gray-700 mb-6">
              Please enter your {paymentMethod === 'gopay' ? 'goPay' : 'mobile money'} PIN to confirm
            </p>

            <div className="max-w-xs mx-auto mb-6">
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="• • • •"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="h-14 text-center text-2xl tracking-widest"
              />
            </div>

            <Button
              onClick={handlePaymentSubmit}
              disabled={pin.length !== 4 || processing}
              className="w-full h-14 bg-green-600 hover:bg-green-700"
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Processing...
                </div>
              ) : (
                `Confirm & Pay ${formatCurrency(fees.totalAmount)}`
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS VIEW
  if (activeView === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="size-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-700 mb-6">
            Your {selectedProvider?.name} bill has been paid successfully
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-bold text-gray-900">{formatCurrency(parseInt(amount))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900 capitalize">{paymentMethod.replace('pesa', ' Pesa')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-medium text-gray-900">TXN{Date.now()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium text-gray-900">{new Date().toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setActiveView('home');
                setFormData({});
                setAmount('');
                setPin('');
              }}
            >
              <Download className="size-4 mr-2" />
              Receipt
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => {
                setActiveView('home');
                setFormData({});
                setAmount('');
                setPin('');
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}