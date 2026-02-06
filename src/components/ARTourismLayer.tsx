import { useState } from 'react';
import { Button } from './ui/button';
import { 
  Camera, 
  ChevronLeft,
  MapPin,
  Info,
  Volume2,
  Languages,
  Maximize2,
  Sparkles,
  Mountain,
  Landmark,
  Trees,
  Palmtree,
  Castle,
  Compass
} from 'lucide-react';

interface ARTourismLayerProps {
  onBack: () => void;
}

export function ARTourismLayer({ onBack }: ARTourismLayerProps) {
  const [arActive, setArActive] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const landmarks = [
    {
      id: 1,
      name: 'Mount Kilimanjaro',
      type: 'Natural Wonder',
      icon: Mountain,
      color: 'from-blue-500 to-cyan-500',
      description: 'Africa\'s highest peak at 5,895m',
      swahili: 'Mlima wa Kilimanjaro - Kilele cha juu zaidi Afrika',
      distance: '12 km away',
      arContent: '3D Mountain Model + Snow Peak Animation'
    },
    {
      id: 2,
      name: 'Serengeti National Park',
      type: 'Wildlife Reserve',
      icon: Trees,
      color: 'from-green-500 to-emerald-500',
      description: 'Home to the Great Migration',
      swahili: 'Mbuga ya Serengeti - Nyumbani kwa Uhamisho Mkuu',
      distance: '45 km away',
      arContent: '3D Animals + Migration Animation'
    },
    {
      id: 3,
      name: 'Stone Town',
      type: 'Historical Site',
      icon: Castle,
      color: 'from-orange-500 to-red-500',
      description: 'UNESCO World Heritage Site',
      swahili: 'Mji Mkongwe - Urithi wa Dunia UNESCO',
      distance: '2 km away',
      arContent: 'Historical Timeline + 360° Tour'
    },
    {
      id: 4,
      name: 'Ngorongoro Crater',
      type: 'Natural Wonder',
      icon: Landmark,
      color: 'from-purple-500 to-pink-500',
      description: 'World\'s largest inactive volcano',
      swahili: 'Bonde la Ngorongoro - Volkeno kubwa zaidi',
      distance: '28 km away',
      arContent: '3D Crater Model + Wildlife Overlay'
    },
    {
      id: 5,
      name: 'Zanzibar Beaches',
      type: 'Coastal Beauty',
      icon: Palmtree,
      color: 'from-teal-500 to-blue-500',
      description: 'Crystal clear waters & white sand',
      swahili: 'Pwani za Zanzibar - Maji safi na mchanga mweupe',
      distance: '5 km away',
      arContent: 'Beach Tour + Marine Life AR'
    },
    {
      id: 6,
      name: 'Olduvai Gorge',
      type: 'Archaeological Site',
      icon: Compass,
      color: 'from-amber-500 to-orange-500',
      description: 'Cradle of Mankind',
      swahili: 'Bonde la Olduvai - Chanzo cha Binadamu',
      distance: '35 km away',
      arContent: 'Evolution Timeline + Fossil AR'
    }
  ];

  const arFeatures = [
    {
      icon: Camera,
      title: 'Point & Discover',
      description: 'Aim your camera at any landmark',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Info,
      title: 'Rich Information',
      description: 'Get instant facts and history',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Volume2,
      title: 'Audio Guides',
      description: 'Listen in Swahili or English',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Sparkles,
      title: '3D Animations',
      description: 'See wildlife & landmarks come alive',
      gradient: 'from-orange-500 to-red-500'
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
              <Camera className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-white mb-1">AR Tourism</h1>
              <p className="text-pink-100 text-sm">Augmented Reality Explorer</p>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex items-center gap-1 w-fit">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                language === 'en' ? 'bg-white text-purple-600' : 'text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('sw')}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                language === 'sw' ? 'bg-white text-purple-600' : 'text-white'
              }`}
            >
              Kiswahili
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* AR Camera Button */}
        <button
          onClick={() => setArActive(!arActive)}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Camera className="size-8" />
              </div>
              <div className="text-left">
                <p className="text-2xl mb-1">Launch AR Camera</p>
                <p className="text-sm text-pink-100">Point at landmarks to explore</p>
              </div>
            </div>
            <Maximize2 className="size-8 group-hover:scale-110 transition-transform" />
          </div>
        </button>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg mb-4">How AR Tourism Works</h3>
          <div className="grid grid-cols-2 gap-3">
            {arFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-4 text-white`}>
                  <Icon className="size-6 mb-3" />
                  <p className="text-sm mb-1">{feature.title}</p>
                  <p className="text-xs text-white/80">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nearby Landmarks */}
        <div>
          <h3 className="text-lg mb-4">Nearby Landmarks & Sites</h3>
          <div className="space-y-3">
            {landmarks.map((landmark) => {
              const Icon = landmark.icon;
              return (
                <button
                  key={landmark.id}
                  onClick={() => setSelectedLandmark(landmark.id.toString())}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95"
                >
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-br ${landmark.color} p-3 rounded-xl text-white`}>
                      <Icon className="size-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{landmark.name}</p>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{landmark.distance}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{landmark.type}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {language === 'en' ? landmark.description : landmark.swahili}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          <Sparkles className="size-3" />
                          <span>{landmark.arContent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AR Features Showcase */}
        <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-3xl p-6 text-white shadow-lg">
          <h3 className="text-xl mb-4">🇹🇿 First AR Tourism Platform</h3>
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-sm mb-2">🦁 See Wildlife in 3D</p>
              <p className="text-xs text-white/80">Lions, elephants, giraffes appear in your camera</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-sm mb-2">🏛️ Historical Timelines</p>
              <p className="text-xs text-white/80">Watch history unfold at archaeological sites</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-sm mb-2">🎧 Audio Guides</p>
              <p className="text-xs text-white/80">Professional narration in Swahili & English</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-sm mb-2">📸 AR Photo Mode</p>
              <p className="text-xs text-white/80">Take photos with virtual animals & landmarks</p>
            </div>
          </div>
        </div>

        {/* National Parks with AR */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg mb-4">Featured AR Experiences</h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">🦁</div>
                <div>
                  <p className="text-sm">Serengeti AR Safari</p>
                  <p className="text-xs text-gray-600">See the Big Five in AR</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">🏔️</div>
                <div>
                  <p className="text-sm">Kilimanjaro Virtual Climb</p>
                  <p className="text-xs text-gray-600">Interactive climbing route</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">🏛️</div>
                <div>
                  <p className="text-sm">Stone Town Heritage Walk</p>
                  <p className="text-xs text-gray-600">AR historical overlay</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Value */}
        <div className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-2xl p-5 text-white text-center">
          <div className="text-3xl mb-3">🎓</div>
          <p className="mb-2">Educational Tourism</p>
          <p className="text-sm text-blue-100">Learn about Tanzania's rich culture, wildlife, and history through immersive AR experiences</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-purple-600 mb-1">50+</p>
            <p className="text-xs text-gray-600">AR Landmarks</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-blue-600 mb-1">100+</p>
            <p className="text-xs text-gray-600">3D Models</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-green-600 mb-1">2</p>
            <p className="text-xs text-gray-600">Languages</p>
          </div>
        </div>
      </div>
    </div>
  );
}
