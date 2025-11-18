import { useState } from 'react';
import { ArrowLeft, Copy, Check, Download } from 'lucide-react';
import { GoPayLogo, GoPayAppIcon, GoPayFavicon } from './GoPayLogo';
import { Button } from '../ui/button';

interface BrandGuidelinesProps {
  onBack: () => void;
}

export function BrandGuidelines({ onBack }: BrandGuidelinesProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const brandColors = [
    {
      name: 'Primary Green',
      hex: '#10b981',
      rgb: 'rgb(16, 185, 129)',
      tailwind: 'emerald-500',
      usage: 'Primary brand color, CTAs, active states',
    },
    {
      name: 'Dark Green',
      hex: '#059669',
      rgb: 'rgb(5, 150, 105)',
      tailwind: 'emerald-600',
      usage: 'Hover states, gradients, emphasis',
    },
    {
      name: 'Light Green',
      hex: '#d1fae5',
      rgb: 'rgb(209, 250, 229)',
      tailwind: 'emerald-100',
      usage: 'Backgrounds, subtle highlights',
    },
    {
      name: 'Accent Teal',
      hex: '#14b8a6',
      rgb: 'rgb(20, 184, 166)',
      tailwind: 'teal-500',
      usage: 'Secondary actions, info states',
    },
    {
      name: 'Gray 900',
      hex: '#111827',
      rgb: 'rgb(17, 24, 39)',
      tailwind: 'gray-900',
      usage: 'Headings, primary text',
    },
    {
      name: 'Gray 700',
      hex: '#374151',
      rgb: 'rgb(55, 65, 81)',
      tailwind: 'gray-700',
      usage: 'Body text, labels',
    },
    {
      name: 'Gray 500',
      hex: '#6b7280',
      rgb: 'rgb(107, 114, 128)',
      tailwind: 'gray-500',
      usage: 'Secondary text, placeholders',
    },
    {
      name: 'Gray 200',
      hex: '#e5e7eb',
      rgb: 'rgb(229, 231, 235)',
      tailwind: 'gray-200',
      usage: 'Borders, dividers',
    },
    {
      name: 'Gray 50',
      hex: '#f9fafb',
      rgb: 'rgb(249, 250, 251)',
      tailwind: 'gray-50',
      usage: 'Backgrounds, cards',
    },
    {
      name: 'White',
      hex: '#ffffff',
      rgb: 'rgb(255, 255, 255)',
      tailwind: 'white',
      usage: 'Primary background, cards',
    },
    {
      name: 'Success Green',
      hex: '#22c55e',
      rgb: 'rgb(34, 197, 94)',
      tailwind: 'green-500',
      usage: 'Success messages, confirmations',
    },
    {
      name: 'Warning Yellow',
      hex: '#f59e0b',
      rgb: 'rgb(245, 158, 11)',
      tailwind: 'amber-500',
      usage: 'Warnings, alerts',
    },
    {
      name: 'Error Red',
      hex: '#ef4444',
      rgb: 'rgb(239, 68, 68)',
      tailwind: 'red-500',
      usage: 'Errors, destructive actions',
    },
    {
      name: 'Info Blue',
      hex: '#3b82f6',
      rgb: 'rgb(59, 130, 246)',
      tailwind: 'blue-500',
      usage: 'Information, links',
    },
  ];

  const typography = [
    {
      name: 'Display',
      font: 'SF Pro Display / System UI',
      weight: '700 (Bold)',
      size: '32px - 48px',
      lineHeight: '1.2',
      usage: 'Hero headings, page titles',
      example: 'goPay Super App',
    },
    {
      name: 'Heading 1',
      font: 'SF Pro Display / System UI',
      weight: '700 (Bold)',
      size: '24px - 32px',
      lineHeight: '1.3',
      usage: 'Section headings',
      example: 'Your Wallet',
    },
    {
      name: 'Heading 2',
      font: 'SF Pro Display / System UI',
      weight: '600 (Semibold)',
      size: '20px - 24px',
      lineHeight: '1.4',
      usage: 'Card titles, subsections',
      example: 'Recent Transactions',
    },
    {
      name: 'Heading 3',
      font: 'SF Pro Display / System UI',
      weight: '600 (Semibold)',
      size: '16px - 18px',
      lineHeight: '1.5',
      usage: 'List items, small headings',
      example: 'Payment Details',
    },
    {
      name: 'Body',
      font: 'SF Pro Text / System UI',
      weight: '400 (Regular)',
      size: '14px - 16px',
      lineHeight: '1.5',
      usage: 'Main body text, descriptions',
      example: 'Send and receive money instantly with goPay.',
    },
    {
      name: 'Body Bold',
      font: 'SF Pro Text / System UI',
      weight: '600 (Semibold)',
      size: '14px - 16px',
      lineHeight: '1.5',
      usage: 'Emphasized text, labels',
      example: 'TZS 125,000.00',
    },
    {
      name: 'Caption',
      font: 'SF Pro Text / System UI',
      weight: '400 (Regular)',
      size: '12px - 14px',
      lineHeight: '1.4',
      usage: 'Small text, hints, metadata',
      example: 'Last updated 2 minutes ago',
    },
    {
      name: 'Button',
      font: 'SF Pro Text / System UI',
      weight: '600 (Semibold)',
      size: '14px - 16px',
      lineHeight: '1',
      usage: 'Button labels, CTAs',
      example: 'Send Money',
    },
  ];

  const spacing = [
    { name: 'xs', value: '4px', usage: 'Tight spacing, icon gaps' },
    { name: 'sm', value: '8px', usage: 'Small gaps, compact layouts' },
    { name: 'md', value: '12px', usage: 'Default spacing' },
    { name: 'lg', value: '16px', usage: 'Card padding, section gaps' },
    { name: 'xl', value: '24px', usage: 'Large sections, page margins' },
    { name: '2xl', value: '32px', usage: 'Major sections' },
    { name: '3xl', value: '48px', usage: 'Page spacing' },
  ];

  const borderRadius = [
    { name: 'sm', value: '8px', usage: 'Small elements, tags' },
    { name: 'md', value: '12px', usage: 'Buttons, inputs' },
    { name: 'lg', value: '16px', usage: 'Cards, containers' },
    { name: 'xl', value: '20px', usage: 'Large cards, modals' },
    { name: '2xl', value: '24px', usage: 'Featured elements' },
    { name: 'full', value: '9999px', usage: 'Pills, rounded buttons' },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-xl font-bold">Brand Guidelines</h1>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-3">goPay Brand Identity</h2>
          <p className="text-gray-700 mb-4">
            Our brand represents trust, speed, and innovation in Tanzania's digital payment ecosystem.
            These guidelines ensure consistency across all touchpoints.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold">Modern</span>
            <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold">Trustworthy</span>
            <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold">Accessible</span>
            <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold">Tanzanian</span>
          </div>
        </div>

        {/* Logo Variants */}
        <div>
          <h2 className="text-2xl font-bold mb-4">1. Logo Variants</h2>
          
          {/* Primary Logo */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-4">
            <h3 className="font-bold mb-3">Primary Logo (Symbol + Wordmark)</h3>
            <div className="bg-gray-50 rounded-xl p-8 mb-3 flex items-center justify-center">
              <GoPayLogo size={80} />
            </div>
            <p className="text-sm text-gray-600">
              Use this as the primary logo in most applications. Maintain clear space equal to the height of the symbol on all sides.
            </p>
          </div>

          {/* App Icon */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-4">
            <h3 className="font-bold mb-3">App Icon (Rounded Square)</h3>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
                <GoPayAppIcon size={80} />
              </div>
              <div className="bg-gray-900 rounded-xl p-6 flex items-center justify-center">
                <GoPayAppIcon size={80} />
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 flex items-center justify-center">
                <GoPayAppIcon size={80} />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Symbol-only version for app icons, favicons, and social media avatars.
            </p>
          </div>

          {/* Alternative Variants */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="font-bold mb-4">Alternative Variants</h3>
            <div className="space-y-4">
              {/* Light Mode */}
              <div>
                <p className="text-sm font-semibold mb-2">Light Mode (Default)</p>
                <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-center">
                  <GoPayLogo variant="light" size={60} />
                </div>
              </div>

              {/* Dark Mode */}
              <div>
                <p className="text-sm font-semibold mb-2">Dark Mode</p>
                <div className="bg-gray-900 rounded-xl p-6 flex items-center justify-center">
                  <GoPayLogo variant="dark" size={60} />
                </div>
              </div>

              {/* Monochrome */}
              <div>
                <p className="text-sm font-semibold mb-2">Monochrome</p>
                <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
                  <GoPayLogo variant="monochrome" size={60} />
                </div>
              </div>

              {/* Reversed */}
              <div>
                <p className="text-sm font-semibold mb-2">Reversed (On Color)</p>
                <div className="bg-green-600 rounded-xl p-6 flex items-center justify-center">
                  <GoPayLogo variant="reversed" size={60} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <h2 className="text-2xl font-bold mb-4">2. Color Palette</h2>
          <div className="grid grid-cols-1 gap-3">
            {brandColors.map((color) => (
              <div
                key={color.name}
                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="flex">
                  <div
                    className="w-20 flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold">{color.name}</h3>
                        <p className="text-sm text-gray-500">{color.usage}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(color.hex, color.name)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        {copiedColor === color.name ? (
                          <Check className="size-4 text-green-600" />
                        ) : (
                          <Copy className="size-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">HEX:</span>{' '}
                        <code className="font-mono font-semibold">{color.hex}</code>
                      </div>
                      <div>
                        <span className="text-gray-500">Tailwind:</span>{' '}
                        <code className="font-mono font-semibold">{color.tailwind}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div>
          <h2 className="text-2xl font-bold mb-4">3. Typography</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-900">
              <strong>Primary Font:</strong> SF Pro Display/Text (iOS), Roboto (Android), System UI (Web)
            </p>
          </div>
          <div className="space-y-3">
            {typography.map((type) => (
              <div
                key={type.name}
                className="bg-white border-2 border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-sm">{type.name}</h3>
                    <p className="text-xs text-gray-500">{type.usage}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>{type.weight}</div>
                    <div>{type.size}</div>
                  </div>
                </div>
                <div
                  className="mt-3 p-3 bg-gray-50 rounded-lg"
                  style={{
                    fontSize: type.size.split(' - ')[0],
                    fontWeight: type.weight.split(' ')[0],
                    lineHeight: type.lineHeight,
                  }}
                >
                  {type.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div>
          <h2 className="text-2xl font-bold mb-4">4. Spacing System</h2>
          <div className="space-y-3">
            {spacing.map((space) => (
              <div
                key={space.name}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center gap-4"
              >
                <div
                  className="bg-green-500 rounded"
                  style={{ width: space.value, height: space.value }}
                />
                <div className="flex-1">
                  <h3 className="font-bold">{space.name}</h3>
                  <p className="text-sm text-gray-500">{space.usage}</p>
                </div>
                <code className="font-mono font-semibold text-sm">{space.value}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <h2 className="text-2xl font-bold mb-4">5. Border Radius</h2>
          <div className="space-y-3">
            {borderRadius.map((radius) => (
              <div
                key={radius.name}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center gap-4"
              >
                <div
                  className="bg-green-500 w-16 h-16"
                  style={{ borderRadius: radius.value }}
                />
                <div className="flex-1">
                  <h3 className="font-bold">{radius.name}</h3>
                  <p className="text-sm text-gray-500">{radius.usage}</p>
                </div>
                <code className="font-mono font-semibold text-sm">{radius.value}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Iconography Style */}
        <div>
          <h2 className="text-2xl font-bold mb-4">6. Iconography Style</h2>
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="font-bold mb-2">Design Principles</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Line style:</strong> 2px stroke width for 24x24 icons</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Rounded corners:</strong> Stroke linecap="round" and linejoin="round"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Color:</strong> Neutral by default (currentColor), can be colored via className</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Grid:</strong> 24x24 pixel base, scalable via size prop</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Style:</strong> Simple, recognizable shapes representing the service</span>
                </li>
              </ul>
            </div>

            <div className="border-t-2 border-gray-100 pt-4">
              <h3 className="font-bold mb-2">Icon Library</h3>
              <p className="text-sm text-gray-600 mb-3">
                Primary icon set: Lucide React (24x24 base) + Custom goPay icons
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <code className="text-sm">
                  import {'{}'} Icon {'}'} from 'lucide-react';<br />
                  import {'{}'} CustomIcon {'}'} from './components/CustomIcons';
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Usage Guidelines */}
        <div>
          <h2 className="text-2xl font-bold mb-4">7. Logo Usage Do's & Don'ts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Do's */}
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
              <h3 className="font-bold text-green-900 mb-3">✓ Do</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• Use approved logo files</li>
                <li>• Maintain clear space around logo</li>
                <li>• Use on approved backgrounds</li>
                <li>• Scale proportionally</li>
                <li>• Use high-resolution versions</li>
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <h3 className="font-bold text-red-900 mb-3">✗ Don't</h3>
              <ul className="space-y-2 text-sm text-red-800">
                <li>• Change logo colors</li>
                <li>• Distort or stretch</li>
                <li>• Add effects or shadows</li>
                <li>• Rotate the logo</li>
                <li>• Recreate or modify</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download Assets */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-2">Download Brand Assets</h2>
          <p className="mb-4 opacity-90">
            Complete logo package including SVG, PNG, and usage guidelines
          </p>
          <Button className="bg-white text-green-600 hover:bg-gray-100 font-bold">
            <Download className="size-5 mr-2" />
            Download Brand Kit
          </Button>
        </div>
      </div>
    </div>
  );
}
