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
  ArrowRight,
  Bot,
  Activity,
  Cpu
} from 'lucide-react';

interface VCDashboard2025Props {
  onBack: () => void;
}

export function VCDashboard2025({ onBack }: VCDashboard2025Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'ainative' | 'cognitive' | 'agents' | 'execution' | 'data'>('overview');

  // 2025 VC Framework - Based on latest research
  const vcFramework2025 = [
    {
      id: 'ainative',
      title: '1. AI-Native from Day 1',
      subtitle: '"Build AI-first or get left behind" - SaaStr/Accel 2025',
      icon: Brain,
      color: 'from-purple-600 via-pink-600 to-red-600',
      score: 96,
      quote: '"AI-native startups are crushing traditional SaaS on efficiency, revenue, and adoption speed. SaaS with AI features is dead weight." - Jason Lemkin, SaaStr Fund',
      keyMetrics: [
        { label: 'AI Adoption', value: '100%', subtitle: 'Not bolted on - architected with AI' },
        { label: 'Efficiency Gain', value: '10x', subtitle: 'vs traditional fintech' },
        { label: 'VC Focus 2025', value: '53%', subtitle: 'of all VC $ goes to AI' }
      ],
      strengths: [
        {
          title: 'AI Agents in Production (Not Chatbots)',
          description: 'Autonomous agents handle fraud detection, loan approvals, itinerary planning, merchant onboarding',
          impact: 'Redesigns workflows - doesn\'t just assist, it executes',
          framework: 'McKinsey State of AI 2025'
        },
        {
          title: 'Multi-Agent Architecture',
          description: 'Fraud Agent + Travel Agent + SME Agent + Safety Agent working together',
          impact: 'Ensemble AI techniques = high-conviction startup marker',
          framework: 'Glasswing Ventures criteria'
        },
        {
          title: 'AI-Powered Economic Identity',
          description: 'ML models trained on 60M+ transaction patterns for credit scoring',
          impact: 'Proprietary AI models = defensibility',
          framework: 'HBR VC criteria'
        },
        {
          title: 'Real-Time Predictive Systems',
          description: 'Transaction fraud prediction, spending forecasts, merchant sales predictions',
          impact: 'AI drives decisions, not humans reviewing dashboards',
          framework: 'QuantumBlack workflow redesign'
        },
        {
          title: 'Swahili-Native Language Models',
          description: 'Custom-trained models for Tanzania context (not generic GPT wrappers)',
          impact: 'Localized AI = moat against generic solutions',
          framework: 'Not a wrapper - proprietary training'
        }
      ],
      defensibility: 'Very High - Proprietary models + Tanzania-specific training data'
    },
    {
      id: 'cognitive',
      title: '2. Cognitive Effects > Network Effects',
      subtitle: 'The new platform dominance playbook',
      icon: Cpu,
      color: 'from-blue-600 via-cyan-600 to-teal-600',
      score: 94,
      quote: '"The future of defensibility isn\'t scale but cognition. Startups that build products capable of anticipating user needs will beat incumbents." - Kirsten Green, Forerunner',
      keyMetrics: [
        { label: 'User Understanding', value: '156', subtitle: 'data points per user' },
        { label: 'Personalization', value: '1:1', subtitle: 'Individual-level intelligence' },
        { label: 'Anticipation', value: 'Proactive', subtitle: 'Predicts needs before asked' }
      ],
      strengths: [
        {
          title: 'Anticipatory Financial Intelligence',
          description: 'AI predicts when you\'ll run low on airtime, need loan, have bill due - acts before you ask',
          impact: 'Cognitive effects compound through understanding, not just data',
          framework: 'Forerunner cognitive effects thesis'
        },
        {
          title: 'Personalized Economic Assistant',
          description: 'Learns your spending habits, income cycles, savings goals - unique per user',
          impact: 'Intelligence that feels personal and irreplaceable',
          framework: 'Win one user at a time with cognition'
        },
        {
          title: 'Context-Aware Recommendations',
          description: 'Knows you\'re in Masaki → recommends nearby restaurants with your cuisine preference',
          impact: 'Location + preferences + history = hyper-relevant',
          framework: 'Multi-modal understanding'
        },
        {
          title: 'Behavioral Learning System',
          description: 'Adapts to how YOU use money - conservative vs risk-taker, saver vs spender',
          impact: 'Gets smarter with every transaction - irreplaceable over time',
          framework: 'Cognitive lock-in > switching costs'
        },
        {
          title: 'Proactive Safety & Fraud Alerts',
          description: 'Detects unusual patterns instantly - "This doesn\'t look like you" intelligence',
          impact: 'Anticipates threats before damage occurs',
          framework: 'Predictive vs reactive'
        }
      ],
      defensibility: 'Very High - Cognitive moat deepens with usage, hard to replicate'
    },
    {
      id: 'agents',
      title: '3. AI Agents Driving Business Impact',
      subtitle: 'Scaling AI to transform workflows',
      icon: Bot,
      color: 'from-orange-600 via-red-600 to-pink-600',
      score: 93,
      quote: '"High performers are deploying AI agents and unlocking value beyond efficiency - they\'re redesigning workflows end-to-end." - QuantumBlack, AI by McKinsey',
      keyMetrics: [
        { label: 'Active Agents', value: '7', subtitle: 'Autonomous AI workers' },
        { label: 'Workflow Impact', value: '80%', subtitle: 'Processes redesigned with AI' },
        { label: 'Scaling', value: 'Real Impact', subtitle: 'Not just efficiency plays' }
      ],
      strengths: [
        {
          title: 'Fraud Detection Agent',
          description: 'Autonomous monitoring of 60M+ transactions, blocks SIM swaps, detects anomalies 24/7',
          impact: 'Replaces entire fraud team - scales infinitely',
          framework: 'Agent = business transformation, not feature'
        },
        {
          title: 'Travel Planning Agent',
          description: 'Builds complete itineraries (flights + hotels + tours + permits) in seconds',
          impact: 'Redesigns travel booking workflow - 10 steps → 1 conversation',
          framework: 'McKinsey workflow redesign'
        },
        {
          title: 'SME Assistant Agent',
          description: 'Generates marketing content, predicts inventory needs, automates invoicing for merchants',
          impact: 'Empowers 100K+ SMEs with AI they couldn\'t afford',
          framework: 'Democratizing AI capability'
        },
        {
          title: 'Credit Scoring Agent',
          description: 'Analyzes spending, income, mobile money patterns → instant loan decisions',
          impact: 'Brings 60M unbanked into credit system with AI underwriting',
          framework: 'Scaling financial inclusion with agents'
        },
        {
          title: 'Government Services Agent',
          description: 'Routes requests, verifies NIDA, processes payments, sends alerts automatically',
          impact: 'Government efficiency at scale - no human bottlenecks',
          framework: 'Public sector transformation'
        }
      ],
      defensibility: 'High - Multi-agent orchestration + proprietary workflows'
    },
    {
      id: 'execution',
      title: '4. Working Product > Pitch Deck',
      subtitle: 'VCs demand execution, not promises',
      icon: Rocket,
      color: 'from-green-600 via-emerald-600 to-teal-600',
      score: 97,
      quote: '"Founders are building leaner, faster, and cheaper. VCs are demanding working products, not pitch decks. AI-native startups with execution chops are standing out." - HBR',
      keyMetrics: [
        { label: 'Live Features', value: '67+', subtitle: 'Shipped and working' },
        { label: 'Build Speed', value: '3 months', subtitle: 'MVP to production' },
        { label: 'Proof of Execution', value: 'Deployed', subtitle: 'Not vaporware' }
      ],
      strengths: [
        {
          title: 'Fully Functional Product Today',
          description: '67+ features live - payments, travel, AI, government services, all working',
          impact: 'Not a demo or prototype - ready for users NOW',
          framework: 'HBR: VCs want working products'
        },
        {
          title: 'Proven Technical Execution',
          description: 'Bank-grade security, offline-first, AI agents, AR tourism - all implemented',
          impact: 'Technical depth proves team can build complex systems',
          framework: 'Execution chops = fundable signal'
        },
        {
          title: 'Rapid Iteration Velocity',
          description: '6 major strategic features added in 1 sprint cycle',
          impact: 'Speed = AI-native advantage (10x faster than traditional)',
          framework: 'SaaStr: AI-native crushes on speed'
        },
        {
          title: 'Government Partnerships In Motion',
          description: 'Digital addressing, NIDA integration, services inbox - regulatory buy-in',
          impact: 'Not just talk - actual government infrastructure adoption',
          framework: 'Execution = partnerships, not pitch slides'
        },
        {
          title: 'Multi-Sided Market Activation',
          description: 'Users + Merchants + Tourism + Government all launched simultaneously',
          impact: 'Complex platform executed - proves founder capability',
          framework: 'Operational complexity = moat'
        }
      ],
      defensibility: 'Very High - Execution track record + proven capability'
    },
    {
      id: 'data',
      title: '5. Proprietary Data Moats',
      subtitle: 'Own the sensors, win the AI era',
      icon: Database,
      color: 'from-indigo-600 via-purple-600 to-pink-600',
      score: 95,
      quote: '"Own the sensors. Data processing will become commoditized. The winner is whoever controls unique data inputs." - Dan Von Kohorn, Broom Ventures',
      keyMetrics: [
        { label: 'Unique Data', value: '60M', subtitle: 'Unbanked user profiles' },
        { label: 'Data Points', value: '156/user', subtitle: 'Transaction patterns' },
        { label: 'First-Mover', value: 'National', subtitle: 'Tanzania infrastructure data' }
      ],
      strengths: [
        {
          title: 'Economic Identity Database',
          description: '60M+ Tanzanians\' transaction history, spending patterns, income cycles',
          impact: 'Proprietary credit scoring data - impossible to replicate',
          framework: 'HBR: Proprietary data = #1 VC criterion'
        },
        {
          title: 'National Digital Address Registry',
          description: 'GPS + Plus Codes for every location in Tanzania - government partnership',
          impact: 'National infrastructure data = regulatory moat',
          framework: 'Own the sensors - addressing is the sensor'
        },
        {
          title: 'Merchant Trust & Safety Network',
          description: 'Verified merchant ratings, transaction patterns, fraud indicators',
          impact: 'Proprietary trust graph - network effects + data moat',
          framework: 'Data compounds with scale'
        },
        {
          title: 'Tourism Movement Intelligence',
          description: 'Where tourists go, when, how much they spend - valuable to entire industry',
          impact: 'Data becomes product - sell insights to hotels, operators, government',
          framework: 'Data monetization beyond core business'
        },
        {
          title: 'Swahili Language Dataset',
          description: 'Millions of local transactions, queries, conversations in Swahili context',
          impact: 'Training data for Tanzania-specific AI - cannot buy from OpenAI',
          framework: 'Proprietary AI training data = AI-native moat'
        }
      ],
      defensibility: 'Very High - First-mover data advantage + regulatory exclusivity'
    }
  ];

  const marketOpportunity2025 = {
    tam: '$12B',
    aiShare: '53%',
    aiFirstPremium: '3-5x',
    adoptionSpeed: '10x faster',
    efficiencyGain: '10x better',
    valuation: '$50M',
    seeking: '$5M',
    round: 'Seed',
    vcContext: '2025 - AI or Nothing'
  };

  const competitiveAdvantages2025 = [
    {
      advantage: 'AI-Native (Not AI Feature)',
      old: 'Traditional fintech + ChatGPT plugin',
      new: 'Architected with AI agents from Day 1',
      impact: '10x efficiency vs incumbents',
      icon: Brain
    },
    {
      advantage: 'Cognitive Effects Moat',
      old: 'Network effects (scale)',
      new: 'Anticipates needs, learns per user',
      impact: 'Irreplaceable over time',
      icon: Cpu
    },
    {
      advantage: 'Working Product (Not Pitch)',
      old: 'Idea + deck',
      new: '67+ features live and deployed',
      impact: 'VC proof of execution',
      icon: Rocket
    },
    {
      advantage: 'Multi-Agent Orchestration',
      old: 'Single chatbot',
      new: '7 autonomous agents redesigning workflows',
      impact: 'Business transformation',
      icon: Bot
    },
    {
      advantage: 'Proprietary Data Sensors',
      old: 'Generic data',
      new: 'National addressing + 60M user economic IDs',
      impact: 'Impossible to replicate',
      icon: Database
    },
    {
      advantage: 'Tanzania-Specific AI Models',
      old: 'Generic GPT wrapper',
      new: 'Custom-trained Swahili models + local context',
      impact: 'Defensible AI',
      icon: Sparkles
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 px-5 pt-8 pb-6 relative overflow-hidden">
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
              <Sparkles className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-white mb-1">2025 VC Framework</h1>
              <p className="text-purple-100 text-sm">AI-Native Era Investment Thesis</p>
            </div>
          </div>

          {/* 2025 VC Context */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mt-4">
            <div className="mb-4">
              <p className="text-white/80 text-xs mb-2">2025 VC Landscape</p>
              <p className="text-white text-2xl mb-1">53% of VC $ → AI Only</p>
              <p className="text-white/80 text-xs">"It's AI or nothing right now" - Institutional Investor</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-white/70 text-xs mb-1">AI-First Premium</p>
                <p className="text-white text-xl">3-5x</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-white/70 text-xs mb-1">Speed Advantage</p>
                <p className="text-white text-xl">10x</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-white/70 text-xs mb-1">goPay Score</p>
                <p className="text-white text-xl">95/100</p>
              </div>
            </div>
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
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          {vcFramework2025.map((criteria) => {
            const Icon = criteria.icon;
            return (
              <button
                key={criteria.id}
                onClick={() => setActiveTab(criteria.id as any)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === criteria.id
                    ? 'bg-purple-600 text-white'
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
            {/* 2025 Framework Cards */}
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white mb-4">
                <h3 className="text-sm mb-2 flex items-center gap-2">
                  <TrendingUp className="size-4" />
                  2025 VC Reality Check
                </h3>
                <p className="text-xl mb-1">AI-Native or Dead Weight</p>
                <p className="text-xs text-red-100">"SaaS with AI features is dead. Build AI-first or get left behind." - SaaStr/Accel</p>
              </div>

              <h3 className="text-lg mb-4">5 Critical Criteria (2025 Framework)</h3>
              {vcFramework2025.map((criteria) => {
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

            {/* Old vs New Playbook */}
            <div>
              <h3 className="text-lg mb-4">2025 Competitive Advantages</h3>
              <div className="space-y-3">
                {competitiveAdvantages2025.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg mt-0.5">
                          <Icon className="size-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-2">{item.advantage}</p>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="bg-red-50 rounded-lg p-2">
                              <p className="text-xs text-red-600 mb-1">❌ Old Way</p>
                              <p className="text-xs text-gray-700">{item.old}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-2">
                              <p className="text-xs text-green-600 mb-1">✅ goPay 2025</p>
                              <p className="text-xs text-gray-700">{item.new}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Impact: {item.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Market Opportunity 2025 */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="text-xl mb-4">Market Opportunity (AI-Native Era)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs text-green-100 mb-1">TAM</p>
                  <p className="text-2xl">{marketOpportunity2025.tam}</p>
                  <p className="text-xs text-green-100">Tanzania Digital Economy</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs text-green-100 mb-1">2025 VC AI Focus</p>
                  <p className="text-2xl">{marketOpportunity2025.aiShare}</p>
                  <p className="text-xs text-green-100">of all VC goes to AI</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs text-green-100 mb-1">AI-First Premium</p>
                  <p className="text-2xl">{marketOpportunity2025.aiFirstPremium}</p>
                  <p className="text-xs text-green-100">valuation multiplier</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs text-green-100 mb-1">Efficiency Gain</p>
                  <p className="text-2xl">{marketOpportunity2025.efficiencyGain}</p>
                  <p className="text-xs text-green-100">vs traditional SaaS</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Individual Criterion Details */}
        {activeTab !== 'overview' && (
          <>
            {vcFramework2025.filter(c => c.id === activeTab).map((criteria) => {
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
                    
                    {/* Key Metrics */}
                    {criteria.keyMetrics && (
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {criteria.keyMetrics.map((metric, idx) => (
                          <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <p className="text-xs opacity-80 mb-1">{metric.label}</p>
                            <p className="text-2xl mb-1">{metric.value}</p>
                            <p className="text-xs opacity-70">{metric.subtitle}</p>
                          </div>
                        ))}
                      </div>
                    )}

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
                    <h3 className="text-lg mb-4">Key Strengths (2025 Framework)</h3>
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
                              <div className="bg-blue-50 rounded-xl p-3 mb-2">
                                <p className="text-xs text-gray-600 mb-1">Impact</p>
                                <p className="text-sm text-blue-900">{strength.impact}</p>
                              </div>
                              <div className="bg-purple-50 rounded-xl p-3">
                                <p className="text-xs text-gray-600 mb-1">2025 Framework</p>
                                <p className="text-sm text-purple-900">{strength.framework}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Defensibility */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 text-white text-center">
                    <p className="text-sm mb-1">Defensibility Rating (2025)</p>
                    <p className="text-xl">{criteria.defensibility}</p>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Investment Ready Badge */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl p-6 text-white text-center shadow-xl">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-2xl mb-2">2025 Investment Ready</h3>
          <p className="text-sm text-purple-100 mb-4">
            AI-native from Day 1 • Cognitive effects moat • Working product deployed • Multi-agent architecture • Proprietary data
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
          <p className="text-xs text-purple-100 mt-4 italic">
            "In 2025, 53% of VC goes to AI. goPay is positioned perfectly." - Based on Institutional Investor data
          </p>
        </div>
      </div>
    </div>
  );
}
