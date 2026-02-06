import { useState } from 'react';
import { ArrowLeft, Search, Star, Download, TrendingUp, Shield, Zap, Users, ChevronRight, ExternalLink, CheckCircle, Sparkles, Award, Lock } from 'lucide-react';
import { Button } from './ui/button';

interface MiniAppsMarketplaceProps {
  onBack: () => void;
}

interface MiniApp {
  id: string;
  name: string;
  developer: string;
  category: 'Finance' | 'Shopping' | 'Travel' | 'Food' | 'Health' | 'Education' | 'Entertainment' | 'Utilities' | 'Business';
  description: string;
  icon: string;
  gradient: string;
  rating: number;
  downloads: string;
  verified: boolean;
  featured: boolean;
  size: string;
  permissions: string[];
  screenshots: string[];
  color: string;
}

const DEMO_MINI_APPS: MiniApp[] = [
  {
    id: 'app-1',
    name: 'Budget Buddy',
    developer: 'FinTech Tanzania Ltd',
    category: 'Finance',
    description: 'AI-powered budget tracking and financial planning assistant with smart insights',
    icon: '💰',
    gradient: 'from-emerald-500 to-teal-600',
    color: 'emerald',
    rating: 4.8,
    downloads: '50K+',
    verified: true,
    featured: true,
    size: '2.5 MB',
    permissions: ['Transaction history', 'Analytics'],
    screenshots: []
  },
  {
    id: 'app-2',
    name: 'FarmDirect',
    developer: 'AgriTech Solutions',
    category: 'Shopping',
    description: 'Buy fresh produce directly from local farmers. Farm-to-table in 24 hours',
    icon: '🌾',
    gradient: 'from-green-500 to-lime-600',
    color: 'green',
    rating: 4.6,
    downloads: '25K+',
    verified: true,
    featured: true,
    size: '5.2 MB',
    permissions: ['Location', 'Payment'],
    screenshots: []
  },
  {
    id: 'app-3',
    name: 'HealthCare+',
    developer: 'MedConnect Tanzania',
    category: 'Health',
    description: 'Book doctor appointments, access medical records, order medicine delivered',
    icon: '🏥',
    gradient: 'from-blue-500 to-cyan-600',
    color: 'blue',
    rating: 4.9,
    downloads: '100K+',
    verified: true,
    featured: true,
    size: '8.1 MB',
    permissions: ['Personal info', 'Payment', 'Notifications'],
    screenshots: []
  },
  {
    id: 'app-4',
    name: 'EduPay',
    developer: 'Education Ministry',
    category: 'Education',
    description: 'Official app for school fees, exam fees, and student services nationwide',
    icon: '🎓',
    gradient: 'from-purple-500 to-pink-600',
    color: 'purple',
    rating: 4.7,
    downloads: '200K+',
    verified: true,
    featured: false,
    size: '3.8 MB',
    permissions: ['Student ID', 'Payment'],
    screenshots: []
  },
  {
    id: 'app-5',
    name: 'PropertyHub',
    developer: 'RealEstate TZ',
    category: 'Business',
    description: 'Find, rent, and buy properties across Tanzania. Virtual tours included',
    icon: '🏠',
    gradient: 'from-orange-500 to-red-600',
    color: 'orange',
    rating: 4.5,
    downloads: '15K+',
    verified: true,
    featured: false,
    size: '12.3 MB',
    permissions: ['Location', 'Payment', 'Camera'],
    screenshots: []
  },
  {
    id: 'app-6',
    name: 'Duka Online',
    developer: 'ShopTZ',
    category: 'Shopping',
    description: 'Shop from thousands of local merchants. Same-day delivery in Dar es Salaam',
    icon: '🛒',
    gradient: 'from-indigo-500 to-purple-600',
    color: 'indigo',
    rating: 4.4,
    downloads: '35K+',
    verified: false,
    featured: false,
    size: '6.7 MB',
    permissions: ['Location', 'Payment'],
    screenshots: []
  },
  {
    id: 'app-7',
    name: 'Event Tickets',
    developer: 'EventBrite TZ',
    category: 'Entertainment',
    description: 'Discover and book tickets for concerts, sports events, and festivals',
    icon: '🎫',
    gradient: 'from-pink-500 to-rose-600',
    color: 'pink',
    rating: 4.6,
    downloads: '45K+',
    verified: true,
    featured: false,
    size: '4.2 MB',
    permissions: ['Location', 'Payment', 'Calendar'],
    screenshots: []
  },
  {
    id: 'app-8',
    name: 'SACCO Manager',
    developer: 'CoopTech',
    category: 'Finance',
    description: 'Manage your SACCO contributions, loans, and dividends in one place',
    icon: '🏦',
    gradient: 'from-teal-500 to-green-600',
    color: 'teal',
    rating: 4.8,
    downloads: '60K+',
    verified: true,
    featured: true,
    size: '5.5 MB',
    permissions: ['Financial data', 'Payment'],
    screenshots: []
  }
];

export function MiniAppsMarketplace({ onBack }: MiniAppsMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<MiniApp | null>(null);
  const [installedApps, setInstalledApps] = useState<Set<string>>(new Set(['app-1', 'app-3']));

  const categories = ['All', 'Finance', 'Shopping', 'Travel', 'Food', 'Health', 'Education', 'Entertainment', 'Utilities', 'Business'];

  const filteredApps = DEMO_MINI_APPS.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredApps = filteredApps.filter(app => app.featured);

  const handleInstall = (appId: string) => {
    setInstalledApps(prev => new Set([...prev, appId]));
  };

  const handleUninstall = (appId: string) => {
    setInstalledApps(prev => {
      const newSet = new Set(prev);
      newSet.delete(appId);
      return newSet;
    });
  };

  if (selectedApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Premium Header */}
        <div className={`bg-gradient-to-br ${selectedApp.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          <div className="relative text-white p-6 pb-10">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-full transition-all">
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-5xl transform hover:scale-105 transition-transform">
                {selectedApp.icon}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold">{selectedApp.name}</h1>
                  {selectedApp.verified && (
                    <div className="bg-white/30 backdrop-blur-sm rounded-full p-1">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <p className="text-white/90 text-sm mb-3">{selectedApp.developer}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <span className="font-semibold">{selectedApp.rating}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                    {selectedApp.downloads}
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                    {selectedApp.size}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 -mt-6 pb-8 space-y-6">
          {/* Install Button Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            {installedApps.has(selectedApp.id) ? (
              <div className="space-y-3">
                <Button className={`w-full h-14 text-base font-semibold bg-gradient-to-r ${selectedApp.gradient} hover:opacity-90 text-white rounded-2xl shadow-lg`}>
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open App
                </Button>
                <Button 
                  onClick={() => handleUninstall(selectedApp.id)}
                  variant="outline" 
                  className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-2xl font-medium"
                >
                  Uninstall
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => handleInstall(selectedApp.id)}
                className={`w-full h-14 text-base font-semibold bg-gradient-to-r ${selectedApp.gradient} hover:opacity-90 text-white rounded-2xl shadow-lg`}
              >
                <Download className="w-5 h-5 mr-2" />
                Install App
              </Button>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              About this app
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {selectedApp.description}
            </p>
          </div>

          {/* Category & Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-5 border border-gray-100">
              <div className="text-sm text-gray-600 mb-2">Category</div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${selectedApp.gradient} text-white rounded-full text-sm font-medium`}>
                {selectedApp.category}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-5 border border-gray-100">
              <div className="text-sm text-gray-600 mb-2">Downloads</div>
              <div className="text-2xl font-bold text-gray-900">{selectedApp.downloads}</div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Permissions Required
            </h3>
            <div className="space-y-3">
              {selectedApp.permissions.map((permission, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Badge */}
          {selectedApp.verified && (
            <div className="bg-gradient-to-br from-blue-50 via-blue-50/50 to-purple-50 rounded-3xl p-6 border-2 border-blue-200/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-1">Verified Developer</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    This app has been thoroughly reviewed and verified by GO Pay's security team. Safe to install and use.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-5 text-center border border-purple-100">
            <Lock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-700 font-medium">
              Developers earn 70% revenue share • Secure payment processing
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Header */}
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative text-white p-6 pb-8">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-all">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">App Marketplace</h1>
              <p className="text-sm text-green-100">Extend GO Pay's capabilities</p>
            </div>
            <div className="w-10" />
          </div>

          {/* Premium Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl border-2 border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Horizontal Category Pills */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="overflow-x-auto px-6 py-4 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Featured Apps - Premium Cards */}
        {featuredApps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
              <h2 className="font-bold text-xl">Featured Apps</h2>
            </div>
            <div className="space-y-4">
              {featuredApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="w-full group"
                >
                  <div className={`bg-gradient-to-br ${app.gradient} rounded-3xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                    <div className="bg-white rounded-[22px] p-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-20 h-20 bg-gradient-to-br ${app.gradient} rounded-2xl flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 transition-transform`}>
                          {app.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{app.name}</h3>
                            {app.verified && (
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1 mb-2">{app.description}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-bold">{app.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500">{app.downloads}</span>
                            {installedApps.has(app.id) && (
                              <span className={`px-2 py-0.5 bg-gradient-to-r ${app.gradient} text-white rounded-full text-xs font-medium`}>
                                Installed
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Apps - Clean List */}
        <div>
          <h2 className="font-bold text-xl mb-5">
            {selectedCategory === 'All' ? 'All Apps' : `${selectedCategory} Apps`}
          </h2>
          <div className="space-y-3">
            {filteredApps.map(app => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="w-full bg-white rounded-2xl p-4 hover:shadow-lg transition-all border border-gray-100 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${app.gradient} rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                    {app.icon}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold truncate">{app.name}</h3>
                      {app.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{app.developer}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold">{app.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{app.category}</span>
                    </div>
                  </div>
                  {installedApps.has(app.id) ? (
                    <div className={`px-3 py-1.5 bg-gradient-to-r ${app.gradient} text-white rounded-full text-xs font-medium flex items-center gap-1`}>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Installed
                    </div>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Developer CTA - Premium */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-3xl p-8 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-2xl mb-3">Build Your Mini-App</h3>
            <p className="text-white/90 mb-6 max-w-sm mx-auto leading-relaxed">
              Join our developer ecosystem. Earn 70% revenue share on every transaction. Zero upfront costs.
            </p>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-6 rounded-2xl shadow-xl">
              <Award className="w-5 h-5 mr-2" />
              Developer Portal
            </Button>
          </div>
        </div>

        {/* Stats - Premium Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-100">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 text-center">50+</div>
            <div className="text-xs text-gray-600 text-center mt-1">Apps</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 text-center">2.5M+</div>
            <div className="text-xs text-gray-600 text-center mt-1">Downloads</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 text-center">40+</div>
            <div className="text-xs text-gray-600 text-center mt-1">Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
}
