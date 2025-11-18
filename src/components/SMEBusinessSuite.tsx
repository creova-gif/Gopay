import { ArrowLeft, TrendingUp, DollarSign, Package, BarChart3, Sparkles, Users, Target, Calendar, MessageCircle, Image, FileText, Heart, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface SMEBusinessSuiteProps {
  onBack: () => void;
}

export function SMEBusinessSuite({ onBack }: SMEBusinessSuiteProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'ai' | 'analytics'>('dashboard');

  const tools = [
    {
      id: 'ai-content',
      name: 'AI Content Writer',
      icon: Sparkles,
      color: 'from-purple-500 to-purple-600',
      description: 'Generate posts, descriptions, menus',
      action: 'Create Content'
    },
    {
      id: 'inventory',
      name: 'Inventory Manager',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      description: 'Track stock, alerts, forecasting',
      action: 'Manage Stock'
    },
    {
      id: 'analytics',
      name: 'Sales Analytics',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      description: 'Insights, trends, predictions',
      action: 'View Analytics'
    },
    {
      id: 'loyalty',
      name: 'Customer Loyalty',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      description: 'Rewards, points, retention',
      action: 'Setup Program'
    }
  ];

  const salesData = {
    today: 125000,
    thisWeek: 850000,
    thisMonth: 3250000,
    growth: 23
  };

  const inventory = [
    { id: '1', name: 'Tanzanite Necklace', stock: 5, minStock: 3, price: 250000, status: 'low' },
    { id: '2', name: 'Coffee Beans (1kg)', stock: 45, minStock: 10, price: 35000, status: 'good' },
    { id: '3', name: 'Handmade Basket', stock: 0, minStock: 5, price: 15000, status: 'out' },
    { id: '4', name: 'Wooden Carving', stock: 12, minStock: 5, price: 45000, status: 'good' }
  ];

  const aiContentTemplates = [
    {
      id: 'product',
      name: 'Product Description',
      icon: Package,
      example: 'Write compelling product descriptions'
    },
    {
      id: 'social',
      name: 'Social Media Post',
      icon: MessageCircle,
      example: 'Create engaging social media content'
    },
    {
      id: 'menu',
      name: 'Menu Item',
      icon: FileText,
      example: 'Write appetizing menu descriptions'
    },
    {
      id: 'promo',
      name: 'Promotion',
      icon: Target,
      example: 'Generate promotional campaigns'
    }
  ];

  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerateContent = () => {
    // Simulate AI generation
    setTimeout(() => {
      if (selectedTemplate === 'product') {
        setGeneratedContent(`**${productName || 'Premium Product'}**\n\nDiscover the authentic beauty of Tanzania with our handcrafted ${productName?.toLowerCase() || 'item'}. Each piece tells a story of local artistry and tradition.\n\n✨ **Features:**\n- Handmade by local artisans\n- Authentic Tanzanian craftsmanship\n- Perfect for gifts or personal collection\n- Ethically sourced materials\n\n🎁 **Makes a perfect gift** for loved ones or a special treat for yourself. Support local businesses and preserve traditional art forms.\n\n📦 **Ships nationwide** with secure packaging\n💳 **Pay with goPay** for instant cashback`);
      } else if (selectedTemplate === 'social') {
        setGeneratedContent(`🌟 NEW ARRIVAL ALERT! 🌟\n\nWe're thrilled to introduce our latest collection of ${productName || 'handcrafted items'}! 🎉\n\nEach piece is:\n✅ Made with love by local artisans\n✅ 100% authentic Tanzanian quality\n✅ Perfect for any occasion\n\nLimited stock available! 🔥\n\n📍 Visit us today or order via goPay\n💰 Special launch discount: 15% OFF\n🚚 Free delivery in Dar es Salaam\n\n#MadeInTanzania #SupportLocal #HandmadeWithLove #TanzanianArt`);
      } else if (selectedTemplate === 'menu') {
        setGeneratedContent(`**${productName || 'Signature Dish'}**\n\nA culinary masterpiece that captures the essence of Tanzanian flavors. Our chefs have perfected this dish using fresh, locally-sourced ingredients.\n\n🌶️ **Taste Profile:** Rich, aromatic, and perfectly balanced\n\n🥘 **Ingredients:** Premium local produce, traditional spices\n\n👨‍🍳 **Chef's Note:** "This dish represents the heart of Tanzanian cuisine - bold flavors with a modern twist"\n\n⏱️ **Preparation Time:** 15-20 minutes\n\n💰 **Price:** Available in Regular and Large portions\n\n🌟 **Customer Favorite** - Rated 4.8/5\n\nPair it with our signature sauce for an unforgettable experience!`);
      } else {
        setGeneratedContent(`🎊 MEGA SALE ALERT! 🎊\n\nFor a LIMITED TIME ONLY:\n\n💥 **${productName || 'All Items'}** - UP TO 40% OFF! 💥\n\n⏰ **Flash Sale:** This Week Only!\n\n🎁 **BONUS:** Free gift with every purchase over TZS 50,000\n\n📱 **How to Claim:**\n1. Visit our store or order via goPay\n2. Use code: GOPAY40\n3. Enjoy your savings!\n\n🚚 **FREE DELIVERY** on orders above TZS 30,000\n\n⚡ **Hurry!** Limited stock available\n\n#Sale #Discount #Tanzania #ShopLocal #goPay`);
      }
    }, 1500);
  };

  if (activeTab === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">SME Business Suite</h1>
                <p className="text-sm text-gray-600">AI-powered tools for your business</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6 pb-24">
          {/* Sales Overview */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Today's Sales</h2>
            <p className="text-4xl font-bold mb-2">TZS {salesData.today.toLocaleString()}</p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="size-4" />
              <span>{salesData.growth}% increase from yesterday</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <p className="text-white/80 text-xs mb-1">This Week</p>
                <p className="font-bold">TZS {(salesData.thisWeek / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-white/80 text-xs mb-1">This Month</p>
                <p className="font-bold">TZS {(salesData.thisMonth / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-white/80 text-xs mb-1">Orders</p>
                <p className="font-bold">89</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Business Tools</h2>
            <div className="space-y-3">
              {tools.map(tool => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      if (tool.id === 'ai-content') {
                        setActiveTab('ai');
                      } else if (tool.id === 'inventory') {
                        setActiveTab('inventory');
                      } else if (tool.id === 'analytics') {
                        setActiveTab('analytics');
                      }
                    }}
                    className="w-full bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`bg-gradient-to-br ${tool.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="size-7 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{tool.name}</h3>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-full">
                        <span className="text-sm font-semibold text-gray-700">{tool.action}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <Package className="size-5 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Low Stock Alert</h3>
            </div>
            <p className="text-sm text-amber-800">
              3 items are running low. Check inventory to restock.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'inventory') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <h1 className="text-2xl font-bold">Inventory Manager</h1>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4 pb-24">
          {inventory.map(item => (
            <div key={item.id} className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">TZS {item.price.toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'out' ? 'bg-red-100 text-red-700' :
                  item.status === 'low' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {item.status === 'out' ? 'OUT OF STOCK' :
                   item.status === 'low' ? 'LOW STOCK' :
                   'IN STOCK'}
                </span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Current Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{item.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">Min Stock</p>
                    <p className="text-lg font-semibold text-gray-700">{item.minStock}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 h-10 rounded-full" variant="outline">
                  Adjust Stock
                </Button>
                <Button className="flex-1 h-10 rounded-full bg-green-600 text-white">
                  Reorder
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'ai') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <Sparkles className="size-6 text-purple-600" />
              <h1 className="text-2xl font-bold">AI Content Writer</h1>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6 pb-24">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-2">Create Professional Content</h2>
            <p className="text-sm text-white/90">
              Let AI write product descriptions, social posts, menus, and more for your business
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Choose Template</h3>
            <div className="grid grid-cols-2 gap-3">
              {aiContentTemplates.map(template => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setShowAIGenerator(true);
                    }}
                    className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all text-left"
                  >
                    <Icon className="size-6 text-purple-600 mb-2" />
                    <p className="font-semibold text-gray-900 text-sm mb-1">{template.name}</p>
                    <p className="text-xs text-gray-600">{template.example}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {generatedContent && (
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h3 className="font-bold text-gray-900 mb-4">Generated Content</h3>
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-sm text-gray-900 whitespace-pre-line">{generatedContent}</p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 h-12 rounded-full">Copy</Button>
                <Button className="flex-1 h-12 rounded-full" variant="outline">Share</Button>
              </div>
            </div>
          )}
        </div>

        {showAIGenerator && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
              <div className="p-6">
                <Sparkles className="size-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-center mb-6">Generate Content</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product/Item Name</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g., Tanzanite Necklace"
                      className="w-full h-12 px-4 border-2 rounded-xl focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      handleGenerateContent();
                      setShowAIGenerator(false);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-full"
                  >
                    Generate with AI
                  </Button>
                  <Button
                    onClick={() => setShowAIGenerator(false)}
                    variant="ghost"
                    className="w-full h-12 rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Analytics tab
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-2xl font-bold">Sales Analytics</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24">
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">Sales Trends</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Tanzanite Jewelry</span>
                <span className="text-sm font-bold">45%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Coffee Products</span>
                <span className="text-sm font-bold">30%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '30%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Handcrafts</span>
                <span className="text-sm font-bold">25%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl p-6">
          <h3 className="font-bold mb-4">AI Recommendations</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Stock up on Tanzanite - selling 40% faster than last month</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Weekend sales are 35% higher - consider weekend promotions</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Peak hours: 2-4 PM - schedule social posts during this time</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
