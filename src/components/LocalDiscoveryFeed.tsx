import { useState } from 'react';
import { Button } from './ui/button';
import { 
  Sparkles, 
  ChevronLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Star,
  Play,
  Users,
  TrendingUp,
  Eye,
  Camera,
  Plus
} from 'lucide-react';

interface LocalDiscoveryFeedProps {
  onBack: () => void;
}

export function LocalDiscoveryFeed({ onBack }: LocalDiscoveryFeedProps) {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following' | 'nearby'>('foryou');

  const posts = [
    {
      id: 1,
      type: 'video',
      creator: 'Amani Tours',
      avatar: '🏔️',
      verified: true,
      title: 'Hidden Waterfall in Morogoro',
      description: 'Most tourists don\'t know about this amazing spot! 🌊',
      location: 'Morogoro, Tanzania',
      likes: 2450,
      comments: 186,
      shares: 92,
      views: 45200,
      tags: ['#HiddenGems', '#Tanzania', '#Waterfall'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      type: 'video',
      creator: 'Mama Juma\'s Kitchen',
      avatar: '🍲',
      verified: false,
      title: 'Best Ugali Recipe',
      description: 'Traditional Tanzanian cooking! Come visit us in Kariakoo 🔥',
      location: 'Kariakoo, Dar es Salaam',
      likes: 5830,
      comments: 342,
      shares: 215,
      views: 89300,
      tags: ['#TanzanianFood', '#Ugali', '#LocalBusiness'],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 3,
      type: 'photo',
      creator: 'Safari Adventures TZ',
      avatar: '🦁',
      verified: true,
      title: 'Lions at Sunset',
      description: 'Incredible sighting in Serengeti yesterday! Book your safari now 🌅',
      location: 'Serengeti National Park',
      likes: 12400,
      comments: 789,
      shares: 456,
      views: 125000,
      tags: ['#Safari', '#Lions', '#Serengeti'],
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 4,
      type: 'video',
      creator: 'Zanzibar Vibes',
      avatar: '🏝️',
      verified: true,
      title: 'Beach Day at Nungwi',
      description: 'Crystal clear waters! 💎 Best time to visit is November-March',
      location: 'Nungwi, Zanzibar',
      likes: 8920,
      comments: 534,
      shares: 312,
      views: 102000,
      tags: ['#Zanzibar', '#Beach', '#Paradise'],
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      id: 5,
      type: 'video',
      creator: 'Street Food Dar',
      avatar: '🌮',
      verified: false,
      title: 'Chips Mayai Challenge',
      description: 'Trying the biggest chips mayai in Dar! Who wants to try? 😋',
      location: 'Mlimani City, Dar es Salaam',
      likes: 3250,
      comments: 198,
      shares: 87,
      views: 38900,
      tags: ['#StreetFood', '#ChipsMayai', '#DarEsSalaam'],
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 6,
      type: 'photo',
      creator: 'Kilimanjaro Climbers',
      avatar: '⛰️',
      verified: true,
      title: 'Uhuru Peak Summit',
      description: 'We made it! 5,895m 🏔️ Book your climb with us',
      location: 'Mount Kilimanjaro',
      likes: 15600,
      comments: 892,
      shares: 678,
      views: 156000,
      tags: ['#Kilimanjaro', '#Summit', '#Adventure'],
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      id: 7,
      type: 'video',
      creator: 'Dar Nightlife',
      avatar: '🎵',
      verified: false,
      title: 'Best Bongo Flava Night',
      description: 'This weekend at Masaki! Don\'t miss it 🔥',
      location: 'Masaki, Dar es Salaam',
      likes: 4560,
      comments: 267,
      shares: 142,
      views: 52000,
      tags: ['#BongoFlava', '#Nightlife', '#Music'],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 8,
      type: 'photo',
      creator: 'TZ Culture Hub',
      avatar: '🎨',
      verified: true,
      title: 'Maasai Traditional Dance',
      description: 'Beautiful cultural performance at Arusha Cultural Center 💃',
      location: 'Arusha, Tanzania',
      likes: 6780,
      comments: 423,
      shares: 289,
      views: 78900,
      tags: ['#Maasai', '#Culture', '#Tanzania'],
      gradient: 'from-red-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 px-5 pt-8 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-full transition-all active:scale-95"
          >
            <ChevronLeft className="size-5 text-white" />
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="size-6 text-white" />
            <h1 className="text-2xl text-white">Discover</h1>
          </div>

          <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-full transition-all active:scale-95">
            <Camera className="size-5 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('foryou')}
            className={`flex-1 py-2 px-4 rounded-full text-sm transition-all ${
              activeTab === 'foryou'
                ? 'bg-white text-purple-600'
                : 'text-white/80 hover:text-white'
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-2 px-4 rounded-full text-sm transition-all ${
              activeTab === 'following'
                ? 'bg-white text-purple-600'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex-1 py-2 px-4 rounded-full text-sm transition-all ${
              activeTab === 'nearby'
                ? 'bg-white text-purple-600'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Nearby
          </button>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Create Post Button */}
        <button className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
          <div className="flex items-center justify-center gap-2">
            <Plus className="size-5" />
            <span>Share Your Discovery</span>
          </div>
        </button>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`bg-gradient-to-br ${post.gradient} p-3 rounded-full text-2xl`}>
                      {post.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-medium">{post.creator}</p>
                        {post.verified && (
                          <div className="bg-blue-500 rounded-full p-0.5">
                            <Star className="size-3 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="size-3" />
                        <span>{post.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Follow
                  </Button>
                </div>
              </div>

              {/* Post Content */}
              <div className={`relative bg-gradient-to-br ${post.gradient} aspect-video overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {post.type === 'video' && (
                    <div className="bg-white/90 p-4 rounded-full">
                      <Play className="size-8 text-gray-900" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-lg mb-1">{post.title}</p>
                  <p className="text-white/90 text-sm">{post.description}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                    <Eye className="size-4" />
                    <span>{(post.views / 1000).toFixed(1)}K</span>
                  </div>
                </div>
              </div>

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-around mb-3">
                  <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                    <Heart className="size-6" />
                    <span className="text-sm">{(post.likes / 1000).toFixed(1)}K</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                    <MessageCircle className="size-6" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                    <Share2 className="size-6" />
                    <span className="text-sm">{post.shares}</span>
                  </button>
                  <button className="hover:text-yellow-500 transition-colors">
                    <Bookmark className="size-6" />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trending Section */}
        <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="size-6" />
            <h3 className="text-xl">Trending in Tanzania</h3>
          </div>
          <div className="space-y-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-sm mb-1">#SerengetiSafari</p>
              <p className="text-xs text-white/80">125K posts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-sm mb-1">#TanzanianFood</p>
              <p className="text-xs text-white/80">89K posts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-sm mb-1">#ZanzibarBeaches</p>
              <p className="text-xs text-white/80">67K posts</p>
            </div>
          </div>
        </div>

        {/* Local Culture Badge */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white text-center">
          <div className="text-3xl mb-2">🇹🇿</div>
          <p className="mb-1">Celebrating Local Culture</p>
          <p className="text-sm text-green-100">Discover hidden gems, local businesses & Tanzanian culture</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-pink-600 mb-1">{posts.length}</p>
            <p className="text-xs text-gray-600">Today's Posts</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-purple-600 mb-1">2.5M</p>
            <p className="text-xs text-gray-600">Total Views</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-blue-600 mb-1">15K</p>
            <p className="text-xs text-gray-600">Active Creators</p>
          </div>
        </div>
      </div>
    </div>
  );
}
