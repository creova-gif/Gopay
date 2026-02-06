import { useState } from 'react';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  ChevronLeft,
  Target,
  Users,
  DollarSign,
  Shield,
  Zap,
  Globe,
  Lightbulb,
  Award,
  Database,
  Brain,
  Rocket,
  Code,
  CheckCircle,
  BarChart3,
  Lock,
  Sparkles,
  TrendingDown,
  Eye,
  Building2,
  MapPin,
  ArrowRight
} from 'lucide-react';

interface VCDashboardEnhancedProps {
  onBack: () => void;
}

export function VCDashboardEnhanced({ onBack }: VCDashboardEnhancedProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'ai' | 'learning' | 'fit' | 'execution'>('overview');

  // VC Criteria Mapping - Based on the image provided
  const vcCriteria = [
    {
      id: 'data',
      title: '1. Proprietary Data Access',
      subtitle: 'The #1 Differentiator',
      icon: Database,
      color: 'from-blue-600 to-cyan-600',
      score: 95,
      quote: '"Own the sensors. Data processing will become commoditized." - Dan Von Kohorn, Broom Ventures',
      strengths: [
        {
          title: 'Economic Identity Platform',
          description: '156 transactions per user, credit scoring for 60M+ Tanzanians',
          impact: 'First-mover data moat for unbanked credit scoring'
        },
        {
          title: 'Smart Digital Addressing',
          description: 'GPS + Plus Codes for every location in Tanzania',
          impact: 'National addressing infrastructure = regulatory approval'
        },
        {
          title: 'Merchant Reputation Engine',
          description: 'Trust scores, safety ratings, transaction patterns',
          impact: 'Proprietary trust network across tourism & commerce'
        },
        {
          title: 'Spending Behavior Analytics',
          description: 'Category breakdowns, savings rates, fraud patterns',
          impact: 'Unlocks financial products for the unbanked'
        },
        {
          title: 'Tourism Movement Patterns',
          description: 'Seasonal flows, popular routes, spending by region',
          impact: 'Valuable to government, tour operators, hospitality'
        }
      ],
      defensibility: 'High - Network effects + regulatory partnership + first-mover advantage'
    },
    {
      id: 'ai',
      title: '2. AI-Native Architecture',
      subtitle: 'Not "wrappers." Built with AI from Day 1.',
      icon: Brain,
      color: 'from-purple-600 to-pink-600',
      score: 92,
      quote: '"High-conviction startups use ensembles, multiple AI techniques, and deep integration." - Rudina Seseri, Glasswing Ventures',
      strengths: [
        {
          title: 'Multi-Modal AI Assistant',
          description: 'Travel planning, SME automation, fraud detection, translation',
          impact: 'Deep AI integration across all services'
        },
        {
          title: 'Real-Time Fraud Detection',
          description: 'Behavioral biometrics, transaction anomaly detection, SIM swap alerts',
          impact: 'Nigeria-level security + proactive risk prevention'
        },
        {
          title: 'AR Tourism Layer',
          description: '3D landmarks, wildlife animations, audio guides in Swahili & English',
          impact: 'First AR tourism platform in East Africa'
        },
        {
          title: 'Predictive Analytics Engine',
          description: 'Loan eligibility, spending forecasts, merchant sales predictions',
          impact: 'AI-powered financial inclusion'
        },
        {
          title: 'Smart Recommendations',
          description: 'Personalized itineraries, local deals, community discovery',
          impact: 'Engagement + retention through AI curation'
        }
      ],
      defensibility: 'High - Proprietary training data + Tanzania-specific models'
    },
    {
      id: 'learning',
      title: '3. Learning Agility',
      subtitle: 'The new founder superpower',
      icon: Zap,
      color: 'from-orange-600 to-red-600',
      score: 88,
      quote: '"Speed at which a founder learns is now more important than what they currently know." - Multiple VCs',
      strengths: [
        {
          title: 'Rapid Feature Deployment',
          description: '6 major features shipped in Phase 1 (3 months)',
          impact: 'Proven execution velocity + iteration speed'
        },
        {
          title: 'Market Feedback Loops',
          description: 'Economic Identity, SIM Swap Protection, Digital Inbox based on user needs',
          impact: 'Customer-driven product development'
        },
        {
          title: 'Technical Depth Scaling',
          description: 'From payments → tourism → AR → AI → government integration',
          impact: 'Expanding technical capabilities rapidly'
        },
        {
          title: 'Regulatory Navigation',
          description: 'Bank of Tanzania compliance, NIDA integration, government partnerships',
          impact: 'Learning complex regulatory environments'
        },
        {
          title: 'Cross-Platform Expertise',
          description: 'Mobile, offline-first, backend, security, AI/ML',
          impact: 'Maniacal learning across tech stack'
        }
      ],
      defensibility: 'High - Team adaptability + execution track record'
    },
    {
      id: 'fit',
      title: '4. Founder-Market Fit',
      subtitle: 'Obsession is mandatory',
      icon: Target,
      color: 'from-green-600 to-emerald-600',
      score: 96,
      quote: '"We love founders who are absolutely obsessed with the problem." - Vivjan Myrto, Hyperplane Ventures',
      strengths: [
        {
          title: 'Deep Tanzania Market Knowledge',
          description: 'Understands connectivity challenges, mobile money ecosystem, tourism gaps',
          impact: 'Lived experience = customer empathy'
        },
        {
          title: 'Financial Inclusion Mission',
          description: 'Building credit history for 60M+ unbanked Tanzanians',
          impact: 'Mission-driven + massive addressable market'
        },
        {
          title: 'Government Relationships',
          description: 'Digital addressing, services inbox, NIDA integration partnerships',
          impact: 'Regulatory approval = competitive moat'
        },
        {
          title: 'Ecosystem Understanding',
          description: 'M-Pesa, TigoPesa, Airtel Money, TANESCO, TRA, NHIF integration',
          impact: 'Industrial intuition GenAI cannot fake'
        },
        {
          title: 'Tourism & Culture Focus',
          description: 'AR heritage sites, Swahili audio guides, local discovery feed',
          impact: 'Authentic connection to Tanzania\'s culture'
        }
      ],
      defensibility: 'Very High - Unique founder insights + market access'
    },
    {
      id: 'execution',
      title: '5. Deep Execution Ability',
      subtitle: 'Ideas are cheap. Execution is everything.',
      icon: Rocket,
      color: 'from-indigo-600 to-blue-600',
      score: 94,
      quote: '"VCs now look for founders who have built and scaled digital products before." - Industry Standard',
      strengths: [
        {
          title: 'Proven Product Velocity',
          description: '67+ features shipped, bank-grade security, offline-first architecture',
          impact: 'Shipped fast, iterated fast, operated at high technical depth'
        },
        {
          title: 'Technical Architecture',
          description: 'Microservices, encrypted databases, fraud detection, AR/AI integration',
          impact: 'Built for scale from Day 1'
        },
        {
          title: 'Security Excellence',
          description: 'SIM swap protection, biometric auth, device fingerprinting, AML compliance',
          impact: 'Bank of Tanzania + telecoms trust = market access'
        },
        {
          title: 'Offline-First Innovation',
          description: 'Works in rural Tanzania, Bluetooth mesh, cached QR payments',
          impact: 'Solves real African connectivity challenges'
        },
        {
          title: 'Cross-Border Ready',
          description: 'Multi-currency wallet, Kenya/Uganda/Rwanda expansion planned',
          impact: 'Scalable across East Africa'
        }
      ],
      defensibility: 'Very High - Technical complexity + execution track record'
    }
  ];

  const marketMetrics = {
    tam: '$12B',
    sam: '$4.8B',
    som: '$480M',
    users: '60M+',
    penetration: '3-5 years',
    arpu: '$24/year',
    ltv: '$180',
    cac: '$8',
    ltvCac: '22.5x'
  };

  const competitiveAdvantages = [
    {
      advantage: 'National Infrastructure',
      description: 'Digital addressing system = government partnership',
      competitors: 'None in Tanzania',
      icon: MapPin
    },
    {
      advantage: 'Proprietary Credit Data',
      description: 'Economic identity for 60M+ unbanked',
      competitors: 'Banks have formal credit only',
      icon: Database
    },
    {
      advantage: 'Offline-First',
      description: 'Works in rural areas with poor connectivity',
      competitors: 'Most fintech requires internet',
      icon: Zap
    },
    {
      advantage: 'AI-Native Platform',
      description: 'Built with AI from Day 1, not bolted on',
      competitors: 'LLM wrappers',
      icon: Brain
    },
    {
      advantage: 'Multi-Sided Network',
      description: 'Users + Merchants + Tourism + Government',
      competitors: 'Single-sided platforms',
      icon: Users
    },
    {
      advantage: 'Bank-Grade Security',
      description: 'SIM swap protection, fraud detection, BoT compliant',
      competitors: 'Basic security',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-5 pt-8 pb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-full mb-6 transition-all active:scale-95"
          >
            <ChevronLeft className="size-5 text-white" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <Award className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-white mb-1">VC Investment Thesis</h1>
              <p className="text-purple-100 text-sm">Gen AI Era Readiness Framework</p>
            </div>
          </div>

          {/* Overall VC Score */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/80 text-sm">Overall VC Readiness Score</span>
              <span className="text-white text-2xl font-mono">93/100</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" style={{ width: '93%' }} />
            </div>
            <p className="text-white/80 text-xs mt-2">Exceptionally Strong - Top 5% of African Fintech</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 py-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          {vcCriteria.map((criteria) => {
            const Icon = criteria.icon;
            return (
              <button
                key={criteria.id}
                onClick={() => setActiveTab(criteria.id as any)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === criteria.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="size-4" />
                {criteria.title.split('.')[0]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-6 space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* 5 VC Criteria Cards */}
            <div className="space-y-3">
              <h3 className="text-lg mb-4">5 Key VC Criteria (Gen AI Era)</h3>
              {vcCriteria.map((criteria) => {
                const Icon = criteria.icon;
                return (
                  <button
                    key={criteria.id}
                    onClick={() => setActiveTab(criteria.id as any)}
                    className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`bg-gradient-to-br ${criteria.color} p-3 rounded-xl text-white flex-shrink-0`}>
                        <Icon className="size-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium mb-1">{criteria.title}</p>
                            <p className="text-sm text-gray-600">{criteria.subtitle}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl text-green-600">{criteria.score}</p>
                            <p className="text-xs text-gray-500">/ 100</p>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                          <div 
                            className={`h-full bg-gradient-to-r ${criteria.color} rounded-full`}
                            style={{ width: `${criteria.score}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{criteria.quote}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {criteria.defensibility}
                          </span>
                          <span className="text-xs text-gray-500">
                            {criteria.strengths.length} key strengths →
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Market Opportunity */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="text-xl mb-4">Market Opportunity</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs text-green-100 mb-1">TAM</p>
                  <p className="text-2xl">{marketMetrics.tam}</p>
                  <p className="text-xs text-green-100">Tanzania Digital Economy</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs text-green-100 mb-1">SAM</p>
                  <p className="text-2xl">{marketMetrics.sam}</p>
                  <p className="text-xs text-green-100">Addressable Market</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs text-green-100 mb-1">Users</p>
                  <p className="text-2xl">{marketMetrics.users}</p>
                  <p className="text-xs text-green-100">Potential Reach</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs text-green-100 mb-1">LTV:CAC</p>
                  <p className="text-2xl">{marketMetrics.ltvCac}</p>
                  <p className="text-xs text-green-100">Unit Economics</p>
                </div>
              </div>
            </div>

            {/* Competitive Advantages */}
            <div>
              <h3 className="text-lg mb-4">Competitive Moats</h3>
              <div className="space-y-3">
                {competitiveAdvantages.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg mt-0.5">
                          <Icon className="size-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{item.advantage}</p>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              Competitors: {item.competitors}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Individual Criterion Details */}
        {activeTab !== 'overview' && (
          <>
            {vcCriteria.filter(c => c.id === activeTab).map((criteria) => {
              const Icon = criteria.icon;
              return (
                <div key={criteria.id} className="space-y-6">
                  {/* Criterion Header */}
                  <div className={`bg-gradient-to-br ${criteria.color} rounded-3xl p-6 text-white shadow-lg`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="size-8" />
                      <div>
                        <h2 className="text-2xl mb-1">{criteria.title}</h2>
                        <p className="text-sm opacity-90">{criteria.subtitle}</p>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                      <p className="text-sm italic">"{criteria.quote}"</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Score</span>
                      <span className="text-3xl">{criteria.score}/100</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-white rounded-full" style={{ width: `${criteria.score}%` }} />
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h3 className="text-lg mb-4">Key Strengths</h3>
                    <div className="space-y-3">
                      {criteria.strengths.map((strength, index) => (
                        <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="bg-green-100 p-2 rounded-lg mt-0.5">
                              <CheckCircle className="size-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium mb-2">{strength.title}</p>
                              <p className="text-sm text-gray-600 mb-3">{strength.description}</p>
                              <div className="bg-blue-50 rounded-xl p-3">
                                <p className="text-xs text-gray-600 mb-1">Impact</p>
                                <p className="text-sm text-blue-900">{strength.impact}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Defensibility */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 text-white text-center">
                    <p className="text-sm mb-1">Defensibility Rating</p>
                    <p className="text-xl">{criteria.defensibility}</p>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Investment Ready Badge */}
        <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl p-6 text-white text-center shadow-xl">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-2xl mb-2">Investment Ready</h3>
          <p className="text-sm text-orange-100 mb-4">
            goPay meets all 5 critical VC criteria for Gen AI Era funding
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs mb-1">Valuation</p>
              <p className="text-xl">$50M</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs mb-1">Seeking</p>
              <p className="text-xl">$5M</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs mb-1">Round</p>
              <p className="text-xl">Seed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
