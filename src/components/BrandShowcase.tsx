import { useState } from 'react';
import { GoPayLogo, GoPayAppIcon, GoPayFavicon, GoPayLogoAnimated } from './branding/GoPayLogo';
import { BrandGuidelines } from './branding/BrandGuidelines';
import { Palette, Download, Book, Eye } from 'lucide-react';
import { Button } from './ui/button';

export function BrandShowcase() {
  const [showGuidelines, setShowGuidelines] = useState(false);

  if (showGuidelines) {
    return <BrandGuidelines onBack={() => setShowGuidelines(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <GoPayLogoAnimated size={120} />
          </div>
          <h1 className="text-4xl font-bold mb-4">goPay Brand Identity</h1>
          <p className="text-xl opacity-90 mb-8">
            Tanzania's trusted super app for payments, rides, and more
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => setShowGuidelines(true)}
              className="bg-white text-green-600 hover:bg-gray-100 font-bold h-12 px-6"
            >
              <Book className="size-5 mr-2" />
              View Brand Guidelines
            </Button>
            <Button className="bg-green-700 hover:bg-green-800 text-white font-bold h-12 px-6">
              <Download className="size-5 mr-2" />
              Download Assets
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Logo Showcase */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Logo Variations</h2>
          
          {/* Primary Logo */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Primary Logo</h3>
            <div className="bg-gray-50 rounded-xl p-12 flex items-center justify-center">
              <GoPayLogo size={100} />
            </div>
          </div>

          {/* All Variants Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Light Mode</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-8 flex items-center justify-center">
                <GoPayLogo variant="light" size={70} />
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Dark Mode</h3>
              <div className="bg-gray-900 rounded-xl p-8 flex items-center justify-center">
                <GoPayLogo variant="dark" size={70} />
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Monochrome</h3>
              <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center">
                <GoPayLogo variant="monochrome" size={70} />
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Reversed</h3>
              <div className="bg-green-600 rounded-xl p-8 flex items-center justify-center">
                <GoPayLogo variant="reversed" size={70} />
              </div>
            </div>
          </div>
        </section>

        {/* App Icon */}
        <section>
          <h2 className="text-3xl font-bold mb-6">App Icon</h2>
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-gray-50 rounded-2xl p-4 mb-2">
                  <GoPayAppIcon size={80} />
                </div>
                <p className="text-xs text-gray-500">Light BG</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-900 rounded-2xl p-4 mb-2">
                  <GoPayAppIcon size={80} />
                </div>
                <p className="text-xs text-gray-500">Dark BG</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 mb-2">
                  <GoPayAppIcon size={80} />
                </div>
                <p className="text-xs text-gray-500">Gradient BG</p>
              </div>
              <div className="text-center">
                <div className="bg-red-500 rounded-2xl p-4 mb-2">
                  <GoPayAppIcon size={80} />
                </div>
                <p className="text-xs text-gray-500">Color BG</p>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Color Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-[#10b981] h-24" />
              <div className="p-4">
                <h3 className="font-bold">Primary Green</h3>
                <p className="text-sm font-mono text-gray-600">#10b981</p>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-[#059669] h-24" />
              <div className="p-4">
                <h3 className="font-bold">Dark Green</h3>
                <p className="text-sm font-mono text-gray-600">#059669</p>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-[#d1fae5] h-24" />
              <div className="p-4">
                <h3 className="font-bold">Light Green</h3>
                <p className="text-sm font-mono text-gray-600">#d1fae5</p>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-[#111827] h-24" />
              <div className="p-4">
                <h3 className="font-bold">Gray 900</h3>
                <p className="text-sm font-mono text-gray-600">#111827</p>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-[#6b7280] h-24" />
              <div className="p-4">
                <h3 className="font-bold">Gray 500</h3>
                <p className="text-sm font-mono text-gray-600">#6b7280</p>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-[#f9fafb] border border-gray-200 h-24" />
              <div className="p-4">
                <h3 className="font-bold">Gray 50</h3>
                <p className="text-sm font-mono text-gray-600">#f9fafb</p>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Typography</h2>
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Display / Hero</p>
              <p className="text-5xl font-bold">goPay Super App</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Heading 1</p>
              <p className="text-3xl font-bold">Your Digital Wallet</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Heading 2</p>
              <p className="text-2xl font-semibold">Recent Transactions</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Body Text</p>
              <p className="text-base">Send and receive money instantly with goPay. Pay bills, book rides, shop online, and more - all in one app.</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Caption</p>
              <p className="text-sm text-gray-600">Last updated 2 minutes ago</p>
            </div>
          </div>
        </section>

        {/* Symbol Meaning */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Symbol Meaning</h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <GoPayAppIcon size={100} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Two-Arrow Loop</h3>
                <p className="text-gray-700 mb-4">
                  The goPay symbol represents the continuous flow of money and services in our ecosystem:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">↻</span>
                    <span><strong>Circular flow:</strong> Money moving seamlessly between users, merchants, and services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">⇄</span>
                    <span><strong>Bidirectional:</strong> Send and receive - complete financial freedom</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">∞</span>
                    <span><strong>Continuous:</strong> Always available, 24/7 financial services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">🇹🇿</span>
                    <span><strong>Tanzanian:</strong> Built for Tanzania, supporting local economy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Use Our Brand?</h2>
            <p className="mb-6 opacity-90">
              Download our complete brand kit or view detailed guidelines
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => setShowGuidelines(true)}
                className="bg-white text-green-600 hover:bg-gray-100 font-bold h-12 px-6"
              >
                <Eye className="size-5 mr-2" />
                View Full Guidelines
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
