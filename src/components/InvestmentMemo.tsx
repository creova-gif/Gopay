import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Database, 
  Brain, 
  Target, 
  Users, 
  DollarSign,
  Globe,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Download
} from 'lucide-react';

interface InvestmentMemoProps {
  onBack: () => void;
}

export function InvestmentMemo({ onBack }: InvestmentMemoProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="text-white hover:bg-emerald-500 mb-4"
        >
          ← Back
        </Button>
        
        <h1 className="text-3xl mb-2">Investment Memo</h1>
        <p className="text-emerald-100">One-page executive summary for investors</p>
      </div>

      {/* Content - Optimized for printing/PDF */}
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        
        {/* Title Block */}
        <div className="text-center border-b-2 border-emerald-600 pb-6">
          <h1 className="text-4xl mb-2">GO App</h1>
          <p className="text-xl text-gray-600 mb-4">Tanzania's First AI-Native National Infrastructure Platform</p>
          <div className="flex gap-2 justify-center">
            <Badge className="bg-emerald-600 text-white">Seed Stage</Badge>
            <Badge className="bg-blue-600 text-white">VC-Ready</Badge>
            <Badge className="bg-purple-600 text-white">Defensible Moat</Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 py-6 border-b">
          <div className="text-center">
            <div className="text-3xl mb-1">60M+</div>
            <div className="text-sm text-gray-600">Total Market</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">2,847</div>
            <div className="text-sm text-gray-600">Merchants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">12</div>
            <div className="text-sm text-gray-600">AI Models</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">8.5M</div>
            <div className="text-sm text-gray-600">Data Points</div>
          </div>
        </div>

        {/* Problem */}
        <div>
          <h2 className="text-2xl mb-3 flex items-center">
            <Target className="h-6 w-6 text-emerald-600 mr-2" />
            Problem
          </h2>
          <p className="text-gray-700 mb-3">
            Tanzania's 60M citizens face a fragmented digital economy with:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <span><strong>80% underbanked</strong> - Limited access to financial services</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <span><strong>Fragmented services</strong> - 10+ apps for payments, travel, government</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <span><strong>Poor connectivity</strong> - Offline-first solutions required</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <span><strong>Tourism disconnect</strong> - $1.5B industry lacks integrated booking</span>
            </li>
          </ul>
        </div>

        {/* Solution */}
        <div>
          <h2 className="text-2xl mb-3 flex items-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 mr-2" />
            Solution
          </h2>
          <p className="text-gray-700 mb-3">
            GO App is <strong>not a super app</strong>—it's <strong>Tanzania's digital infrastructure</strong>, 
            integrating payments, government services, tourism, and commerce with AI-native architecture.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 text-emerald-600 mr-2" />
                <h3 className="">Fintech</h3>
              </div>
              <p className="text-sm text-gray-600">
                Mobile money, virtual cards, micro-loans, multi-currency wallet, community pools
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Globe className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="">Government</h3>
              </div>
              <p className="text-sm text-gray-600">
                NIDA verification, e-fines, tax payments, school fees, municipal services
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="">Tourism</h3>
              </div>
              <p className="text-sm text-gray-600">
                Hotels, flights, safaris, ferries, car rentals, multi-modal trip planning
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="">Commerce</h3>
              </div>
              <p className="text-sm text-gray-600">
                Shopping marketplace, AI assistant, parcel shipping, delivery tracking
              </p>
            </div>
          </div>
        </div>

        {/* Defensible Moats */}
        <div>
          <h2 className="text-2xl mb-3 flex items-center">
            <Shield className="h-6 w-6 text-emerald-600 mr-2" />
            Defensible Moats
          </h2>
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-emerald-50 rounded-lg">
              <Database className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="mb-1">Tanzania Merchant Graph</h3>
                <p className="text-sm text-gray-600">
                  Proprietary dataset mapping 2,847+ merchants, tourist hotspots, and business connections. 
                  This becomes Tanzania's first economic intelligence graph—data no competitor can replicate.
                </p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-blue-50 rounded-lg">
              <Brain className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="mb-1">AI-Native Infrastructure</h3>
                <p className="text-sm text-gray-600">
                  12 production AI models (routing, pricing, fraud, credit scoring) trained on proprietary data. 
                  97.2% average accuracy. AI at infrastructure level, not bolted-on features.
                </p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-purple-50 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="mb-1">10x Learning Velocity</h3>
                <p className="text-sm text-gray-600">
                  2-week release cycle, 10 regional beta groups, real-time telemetry. 
                  We iterate 10x faster than traditional competitors through rapid feedback loops.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Opportunity */}
        <div>
          <h2 className="text-2xl mb-3">Market Opportunity</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="mb-2">Total Addressable Market:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 60M+ Tanzanians (80% underbanked)</li>
                <li>• $1.5B tourism industry (pre-COVID, growing)</li>
                <li>• $63B GDP, fastest growing in East Africa</li>
                <li>• 46M active mobile money users</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2">Revenue Streams:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 15% commission on transactions</li>
                <li>• Merchant subscription fees</li>
                <li>• Tourism booking commissions (10-20%)</li>
                <li>• Premium membership tiers</li>
                <li>• Data intelligence products (B2B)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Traction */}
        <div>
          <h2 className="text-2xl mb-3">Traction & Milestones</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg text-center">
              <div className="text-3xl mb-1">2,847</div>
              <div className="text-sm text-gray-600">Merchants Onboarded</div>
              <div className="text-xs text-emerald-700 mt-1">+34% month-over-month</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center">
              <div className="text-3xl mb-1">480</div>
              <div className="text-sm text-gray-600">Waitlist Signups</div>
              <div className="text-xs text-blue-700 mt-1">Beta launch ready</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg text-center">
              <div className="text-3xl mb-1">3</div>
              <div className="text-sm text-gray-600">Partnership Talks</div>
              <div className="text-xs text-purple-700 mt-1">Bank, telecom, tourism</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
              <span>Complete platform with 60+ features</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
              <span>Bank-grade security & compliance architecture</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
              <span>45 user interviews (tourists, SMEs, riders)</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
              <span>Offline-first architecture tested</span>
            </div>
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-2xl mb-3">Founder-Market Fit</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="mb-2 text-sm text-gray-500 uppercase">Unfair Advantages</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• East African origin - deep market understanding</li>
                <li>• BIPOC community experience</li>
                <li>• Research background - systematic problem-solving</li>
                <li>• Cultural + technical expertise</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm text-gray-500 uppercase">Technical Stack</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Full-stack development (React, Node.js)</li>
                <li>• AI/ML integration (12 production models)</li>
                <li>• Financial systems architecture</li>
                <li>• Mobile-first + offline-first design</li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Ask */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-lg border-2 border-emerald-200">
          <h2 className="text-2xl mb-3">The Ask</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="mb-2">Seed Round: $1.5M - $2M</h3>
              <p className="text-sm text-gray-700 mb-3">
                Use of funds over 12 months:
              </p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 40% Product development & AI infrastructure</li>
                <li>• 30% Market launch (Dar, Arusha, Zanzibar)</li>
                <li>• 20% Team expansion (5-8 key hires)</li>
                <li>• 10% Operations & compliance</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2">12-Month Targets</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <Target className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>10,000</strong> active users</span>
                </li>
                <li className="flex items-start">
                  <Target className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>$1M+</strong> monthly transaction volume</span>
                </li>
                <li className="flex items-start">
                  <Target className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>3 cities</strong> live (Dar, Arusha, Zanzibar)</span>
                </li>
                <li className="flex items-start">
                  <Target className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Bank partnership</strong> signed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Now */}
        <div>
          <h2 className="text-2xl mb-3">Why Now?</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <span><strong>Mobile money adoption at inflection point</strong> - 46M users, ready for unified platform</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <span><strong>Tourism recovery</strong> - Post-COVID rebound creating demand for integrated booking</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <span><strong>Government digitization</strong> - Push for e-services creates opportunity for integration</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1 flex-shrink-0" />
              <span><strong>AI infrastructure advantage</strong> - First mover in AI-native African fintech</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-center pt-6 border-t-2 border-emerald-600">
          <p className="text-gray-600 mb-4">For detailed pitch deck and financial projections:</p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Download Full Deck
            </Button>
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              Schedule Meeting
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
