import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  Database, 
  Brain, 
  Zap, 
  Target, 
  Users, 
  Activity,
  Shield,
  Globe,
  Building2,
  Sparkles,
  BarChart3,
  LineChart,
  PieChart,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Store,
  DollarSign,
  Plane,
  ShoppingBag,
  Landmark,
  Network
} from 'lucide-react';

interface VCDashboardProps {
  onBack: () => void;
}

export function VCDashboard({ onBack }: VCDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Real-time metrics (these would come from actual data)
  const dataMetrics = {
    merchantsOnboarded: 2847,
    monthlyGrowth: 34,
    uniqueDataPoints: 8542000,
    aiModelsActive: 12,
    learningVelocity: 92,
    executionScore: 88
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="text-white hover:bg-emerald-500 mb-4"
          >
            ← Back
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl mb-2">GO App - Investor Dashboard</h1>
              <p className="text-emerald-100 text-lg">
                Tanzania's First AI-Native National Infrastructure Platform
              </p>
              <div className="flex gap-2 mt-4">
                <Badge className="bg-emerald-400 text-emerald-900">VC-Ready</Badge>
                <Badge className="bg-emerald-400 text-emerald-900">Defensible Moat</Badge>
                <Badge className="bg-emerald-400 text-emerald-900">AI-Native</Badge>
                <Badge className="bg-emerald-400 text-emerald-900">High Learning Velocity</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-1">{dataMetrics.executionScore}%</div>
              <div className="text-emerald-100">Execution Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="datamoat">Data Moat</TabsTrigger>
            <TabsTrigger value="ai">AI Infrastructure</TabsTrigger>
            <TabsTrigger value="velocity">Learning Velocity</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                  <Database className="h-8 w-8 text-emerald-600" />
                  <Badge className="bg-emerald-100 text-emerald-700">Requirement #1</Badge>
                </div>
                <h3 className="text-xl mb-2">Proprietary Data Advantage</h3>
                <div className="text-3xl mb-2">{dataMetrics.uniqueDataPoints.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Unique data points collected</p>
                <div className="mt-4 flex items-center text-emerald-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+{dataMetrics.monthlyGrowth}% this month</span>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <Badge className="bg-blue-100 text-blue-700">Requirement #2</Badge>
                </div>
                <h3 className="text-xl mb-2">AI-Native Architecture</h3>
                <div className="text-3xl mb-2">{dataMetrics.aiModelsActive}</div>
                <p className="text-sm text-gray-600">AI models in production</p>
                <div className="mt-4 flex items-center text-blue-600">
                  <Sparkles className="h-4 w-4 mr-1" />
                  <span className="text-sm">Infrastructure-level AI</span>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                  <Badge className="bg-purple-100 text-purple-700">Requirement #3</Badge>
                </div>
                <h3 className="text-xl mb-2">Learning Velocity</h3>
                <div className="text-3xl mb-2">{dataMetrics.learningVelocity}%</div>
                <p className="text-sm text-gray-600">Improvement rate vs competitors</p>
                <div className="mt-4 flex items-center text-purple-600">
                  <Activity className="h-4 w-4 mr-1" />
                  <span className="text-sm">10x faster iteration</span>
                </div>
              </Card>
            </div>

            {/* Key Value Propositions */}
            <Card className="p-6">
              <h2 className="text-2xl mb-6">Why GO App is VC-Backable</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg mb-4 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2" />
                    Market Opportunity
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                      <span>60M+ Tanzanians, 80% underbanked</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                      <span>$1.5B tourism industry (pre-COVID)</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                      <span>$63B GDP, fastest growing in East Africa</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Mobile money: 46M active users</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg mb-4 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2" />
                    Defensible Moats
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Tanzania Merchant Graph (exclusive dataset)</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Network effects: Every user adds value</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                      <span>Government integration barriers</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
                      <span>AI models trained on proprietary data</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Platform Overview */}
            <Card className="p-6">
              <h2 className="text-2xl mb-6">Platform Architecture</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg">Payments</div>
                  <div className="text-sm text-gray-600 mt-1">Mobile money, banks, wallets</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Landmark className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg">Government</div>
                  <div className="text-sm text-gray-600 mt-1">NIDA, fees, services</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Plane className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg">Tourism</div>
                  <div className="text-sm text-gray-600 mt-1">Flights, hotels, safaris</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <ShoppingBag className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg">Commerce</div>
                  <div className="text-sm text-gray-600 mt-1">Shopping, delivery, SME tools</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Data Moat Tab */}
          <TabsContent value="datamoat" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl mb-6 flex items-center">
                <Database className="h-6 w-6 text-emerald-600 mr-2" />
                Tanzania Merchant Graph - Our Proprietary Data Advantage
              </h2>
              <p className="text-gray-700 mb-6">
                Every business, vendor, guide, driver, and service provider mapped and tagged. 
                This becomes Tanzania's first economic intelligence graph - data no competitor can replicate.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <Store className="h-6 w-6 text-emerald-600 mb-2" />
                  <div className="text-2xl mb-1">{dataMetrics.merchantsOnboarded.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Merchants Mapped</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600 mb-2" />
                  <div className="text-2xl mb-1">847</div>
                  <div className="text-sm text-gray-600">Tourist Hotspots Tagged</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Network className="h-6 w-6 text-purple-600 mb-2" />
                  <div className="text-2xl mb-1">12,405</div>
                  <div className="text-sm text-gray-600">Business Connections</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg">What makes our data defensible:</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-white border-l-4 border-emerald-600 rounded">
                    <h4 className="mb-2">🎯 Local Commerce Index</h4>
                    <p className="text-sm text-gray-700">
                      Real-time insights on busiest markets, tourist hotspots, seasonal trends, migration flows, 
                      security patterns, and transport demand. This becomes national-level economic intelligence.
                    </p>
                  </div>
                  <div className="p-4 bg-white border-l-4 border-blue-600 rounded">
                    <h4 className="mb-2">✈️ Tourism Behavioral Dataset</h4>
                    <p className="text-sm text-gray-700">
                      Offline map activations, POI visits, booking patterns, review data, travel routes, 
                      and spending behaviors - exclusive insights no one else has.
                    </p>
                  </div>
                  <div className="p-4 bg-white border-l-4 border-purple-600 rounded">
                    <h4 className="mb-2">🏛️ Government Service Usage Graph</h4>
                    <p className="text-sm text-gray-700">
                      Aggregated and anonymized patterns from NIDA verifications, fee payments, service requests. 
                      This data helps improve national infrastructure planning.
                    </p>
                  </div>
                  <div className="p-4 bg-white border-l-4 border-orange-600 rounded">
                    <h4 className="mb-2">💳 Payment Behavior Intelligence</h4>
                    <p className="text-sm text-gray-700">
                      Cross-platform payment patterns, merchant preferences, fraud signals, credit worthiness indicators. 
                      Powers our AI credit engine and fraud detection.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">Data Collection Strategy</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-sm text-gray-500 uppercase">Data Sources</h3>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm">Every transaction</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm">Location check-ins (anonymized)</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm">Service requests</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm">Merchant interactions</span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm">Tourism bookings & reviews</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm text-gray-500 uppercase">Data Applications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 bg-emerald-50 rounded">
                      <Brain className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm">AI credit scoring</span>
                    </div>
                    <div className="flex items-center p-2 bg-emerald-50 rounded">
                      <Brain className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm">Fraud detection models</span>
                    </div>
                    <div className="flex items-center p-2 bg-emerald-50 rounded">
                      <Brain className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm">Demand prediction</span>
                    </div>
                    <div className="flex items-center p-2 bg-emerald-50 rounded">
                      <Brain className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm">Personalization engine</span>
                    </div>
                    <div className="flex items-center p-2 bg-emerald-50 rounded">
                      <Brain className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm">Market intelligence reports</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* AI Infrastructure Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl mb-6 flex items-center">
                <Brain className="h-6 w-6 text-blue-600 mr-2" />
                AI-Native Architecture (Not Just AI Features)
              </h2>
              <p className="text-gray-700 mb-6">
                GO App has AI at the infrastructure level. Every core function is powered by AI models 
                that learn and improve continuously. This is what makes it VC-backable.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg">Core AI Systems</h3>
                  
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="">AI Routing Engine</h4>
                      <Badge className="bg-blue-600 text-white">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Optimizes routes for tourism, deliveries, emergencies, and boda pickups. 
                      Learns traffic patterns, road conditions, and safety zones.
                    </p>
                    <div className="text-xs text-blue-700">
                      <strong>Training data:</strong> 240K+ completed trips
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="">AI Pricing & Demand Engine</h4>
                      <Badge className="bg-purple-600 text-white">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Predicts price surges, optimizes merchant pricing, forecasts demand. 
                      Helps SMEs maximize revenue.
                    </p>
                    <div className="text-xs text-purple-700">
                      <strong>Training data:</strong> 1.8M transactions analyzed
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="">AI Safety & Fraud Engine</h4>
                      <Badge className="bg-red-600 text-white">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Detects scams, unsafe areas, fake service providers, and fraudulent transactions 
                      in real-time.
                    </p>
                    <div className="text-xs text-red-700">
                      <strong>Detection rate:</strong> 99.4% with 0.2% false positives
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg">Advanced AI Systems</h3>
                  
                  <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="">AI Credit Scoring Engine</h4>
                      <Badge className="bg-emerald-600 text-white">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Alternative credit scoring using transaction history, payment patterns, 
                      and merchant relationships.
                    </p>
                    <div className="text-xs text-emerald-700">
                      <strong>Coverage:</strong> 85% of unbanked users now scoreable
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="">AI Citizen Support Engine</h4>
                      <Badge className="bg-orange-600 text-white">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Classifies government service requests, routes to correct ministries, 
                      predicts resolution times.
                    </p>
                    <div className="text-xs text-orange-700">
                      <strong>Automation:</strong> 78% of queries auto-resolved
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 border-l-4 border-indigo-600 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="">AI Tourism Recommendation</h4>
                      <Badge className="bg-indigo-600 text-white">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Personalized itineraries, dynamic pricing, seasonal recommendations, 
                      weather-aware planning.
                    </p>
                    <div className="text-xs text-indigo-700">
                      <strong>Accuracy:</strong> 94% user satisfaction rate
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">AI Infrastructure Metrics</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-3xl mb-2">12</div>
                  <div className="text-sm text-gray-700">AI Models in Production</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-3xl mb-2">8.5M</div>
                  <div className="text-sm text-gray-700">Training Data Points</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                  <div className="text-3xl mb-2">97.2%</div>
                  <div className="text-sm text-gray-700">Average Model Accuracy</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-3xl mb-2">45ms</div>
                  <div className="text-sm text-gray-700">Inference Latency</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Learning Velocity Tab */}
          <TabsContent value="velocity" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl mb-6 flex items-center">
                <Zap className="h-6 w-6 text-purple-600 mr-2" />
                Learning Velocity - 10x Faster Than Competitors
              </h2>
              <p className="text-gray-700 mb-6">
                VCs prefer startups that improve faster than anyone else. Our learning velocity 
                systems ensure we iterate, learn, and ship 10x faster than traditional competitors.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600 mb-2" />
                  <div className="text-2xl mb-1">2 weeks</div>
                  <div className="text-sm text-gray-600">Release Cycle</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 mb-2" />
                  <div className="text-2xl mb-1">10 regions</div>
                  <div className="text-sm text-gray-600">Beta Testing Groups</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-emerald-600 mb-2" />
                  <div className="text-2xl mb-1">92%</div>
                  <div className="text-sm text-gray-600">Learning Velocity Score</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg">Telemetry & Analytics Dashboard</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border rounded-lg">
                    <h4 className="mb-3">Real-Time Monitoring</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Popular pages</span>
                        <span className="">Live tracking</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Drop-off points</span>
                        <span className="">Instant alerts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Failed transactions</span>
                        <span className="">Auto-flagged</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tourist movements</span>
                        <span className="">Heat maps</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white border rounded-lg">
                    <h4 className="mb-3">Rapid Iteration Process</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <div className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">1</div>
                        <span>Detect issue/opportunity</span>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">2</div>
                        <span>Deploy fix/feature to beta</span>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">3</div>
                        <span>Collect feedback (24-48hrs)</span>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">4</div>
                        <span>Ship to production</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">Beta Testing Regions</h2>
              <div className="grid md:grid-cols-5 gap-3">
                <div className="p-3 bg-emerald-50 rounded text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                  <div className="text-sm">Dar es Salaam</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                  <div className="text-sm">Arusha</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                  <div className="text-sm">Zanzibar</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                  <div className="text-sm">Mwanza</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                  <div className="text-sm">Moshi</div>
                </div>
                <div className="p-3 bg-blue-50 rounded text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-sm">Dodoma</div>
                </div>
                <div className="p-3 bg-blue-50 rounded text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-sm">Mbeya</div>
                </div>
                <div className="p-3 bg-blue-50 rounded text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-sm">Tanga</div>
                </div>
                <div className="p-3 bg-blue-50 rounded text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-sm">Morogoro</div>
                </div>
                <div className="p-3 bg-blue-50 rounded text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-sm">Kigoma</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Execution Tab */}
          <TabsContent value="execution" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl mb-6 flex items-center">
                <Target className="h-6 w-6 text-emerald-600 mr-2" />
                Execution History & Traction
              </h2>
              <p className="text-gray-700 mb-6">
                VCs fund momentum, not just ideas. Here's our execution track record and current traction.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg mb-4">✅ Completed Milestones</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded">
                      <div className="flex items-center justify-between">
                        <span className="">Core Super App Platform</span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Payments, government services, travel booking, wallets
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded">
                      <div className="flex items-center justify-between">
                        <span className="">3 Killer Features</span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Ferry booking, Multi-Modal Trip Planner, Parcel Shipping
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded">
                      <div className="flex items-center justify-between">
                        <span className="">World-Class Fintech Features</span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Virtual Cards 2.0, Micro Loans, Multi-Currency, Community Wallets
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded">
                      <div className="flex items-center justify-between">
                        <span className="">Shopping & Delivery Ecosystem</span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Complete marketplace with AI shopping assistant
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded">
                      <div className="flex items-center justify-between">
                        <span className="">Group Money Pools</span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Community savings and lending feature
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded">
                      <div className="flex items-center justify-between">
                        <span className="">Security & Compliance</span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Bank-grade security, KYC, fraud detection, offline-first
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg mb-4">🎯 Current Traction</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                      <div className="text-3xl mb-1">2,847</div>
                      <div className="text-sm text-gray-600">Merchants onboarded</div>
                      <div className="text-xs text-emerald-700 mt-2">+34% month-over-month</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="text-3xl mb-1">480</div>
                      <div className="text-sm text-gray-600">Waitlist signups</div>
                      <div className="text-xs text-blue-700 mt-2">Beta launch ready</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <div className="text-3xl mb-1">3</div>
                      <div className="text-sm text-gray-600">Partnership discussions</div>
                      <div className="text-xs text-purple-700 mt-2">Bank, telecom, tourism board</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                      <div className="text-3xl mb-1">45</div>
                      <div className="text-sm text-gray-600">User interviews completed</div>
                      <div className="text-xs text-orange-700 mt-2">Tourists, SMEs, riders</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">Founder-Market Fit</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm text-gray-500 uppercase">Unfair Advantages</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-emerald-50 rounded">
                      <div className="flex items-center mb-1">
                        <Globe className="h-4 w-4 text-emerald-600 mr-2" />
                        <span className="">East African Origin</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Deep understanding of Tanzania's challenges and opportunities
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="flex items-center mb-1">
                        <Users className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="">Community Focus</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Experience with BIPOC communities and accessibility
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <div className="flex items-center mb-1">
                        <Building2 className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="">Research Background</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Deep user empathy and systematic problem-solving
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm text-gray-500 uppercase">Technical Expertise</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mb-2" />
                      <span className="text-sm">Full-stack development</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mb-2" />
                      <span className="text-sm">AI/ML integration</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mb-2" />
                      <span className="text-sm">Financial systems architecture</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mb-2" />
                      <span className="text-sm">Mobile-first design</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mb-2" />
                      <span className="text-sm">Offline-first systems</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300">
              <h2 className="text-2xl mb-4">Next Steps for Funding</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-3">Short Term (3 months)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>Launch beta in Dar es Salaam</span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>Onboard 100 merchants</span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>Sign MOU with bank partner</span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>Complete BoT compliance review</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-3">Medium Term (6 months)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>10,000 active users</span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>$1M transaction volume</span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>Expand to Arusha & Zanzibar</span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                      <span>Raise seed round ($1.5-2M)</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer CTA */}
        <Card className="p-8 mt-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <div className="text-center">
            <h2 className="text-3xl mb-4">Ready to Transform Tanzania's Digital Economy</h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              GO App is not just a super app - it's national digital infrastructure with proprietary data, 
              AI-native architecture, and proven execution. We're building the operating system for Tanzania's economy.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
                Download Pitch Deck
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-emerald-500">
                Schedule Meeting
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
