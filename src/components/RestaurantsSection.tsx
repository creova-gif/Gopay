import { useState } from 'react';
import { Clock, MapPin, Phone, Globe, Bike, Utensils, ShoppingBag, ChevronRight, ChevronDown, ChevronUp, Star } from 'lucide-react';

interface RestaurantsSectionProps {
  onNavigate: (page: string) => void;
}

export function RestaurantsSection({ onNavigate }: RestaurantsSectionProps) {
  const [expandedRestaurants, setExpandedRestaurants] = useState<number[]>([]);

  const toggleRestaurant = (id: number) => {
    setExpandedRestaurants(prev => 
      prev.includes(id) 
        ? prev.filter(rid => rid !== id)
        : [...prev, id]
    );
  };

  // Real Tanzania restaurants (Dar es Salaam, Arusha, Zanzibar)
  const restaurants = [
    {
      id: 1,
      name: "The Slipway",
      cuisine: "Seafood • Continental • Waterfront Dining",
      rating: 4.7,
      reviews: "3.2k",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
      deliveryTime: "25-35 min",
      distance: "4.2 km",
      minOrder: "25,000",
      phone: "+255 22 260 0893",
      website: "slipway.co.tz",
      hours: "8:00 AM - 11:00 PM",
      location: "Msasani Peninsula, Dar es Salaam",
      priceRange: "TZS 20,000 - 60,000",
      specialBadge: { text: "Premium", color: "blue", icon: "🏆" },
      badges: [
        { text: "Ocean View", color: "blue", icon: true },
        { text: "Table Booking", color: "purple", icon: false }
      ]
    },
    {
      id: 2,
      name: "Addis in Dar",
      cuisine: "Ethiopian • Traditional • Coffee Ceremony",
      rating: 4.8,
      reviews: "2.8k",
      image: "https://images.unsplash.com/photo-1609792790758-0994786ad983?w=800&q=80",
      deliveryTime: "20-30 min",
      distance: "2.1 km",
      minOrder: "15,000",
      phone: "+255 713 333 999",
      website: "addisindar.co.tz",
      hours: "11:00 AM - 10:30 PM",
      location: "Masaki, Dar es Salaam",
      priceRange: "TZS 12,000 - 35,000",
      specialBadge: { text: "Most Popular", color: "red", icon: "🔥" },
      badges: [
        { text: "Free Delivery", color: "green", icon: true },
        { text: "Vegetarian Options", color: "green", icon: false }
      ]
    },
    {
      id: 3,
      name: "The Waterfront Sunset Restaurant",
      cuisine: "International • Grill • Fine Dining",
      rating: 4.9,
      reviews: "4.1k",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      deliveryTime: "30-40 min",
      distance: "5.8 km",
      minOrder: "30,000",
      phone: "+255 22 260 0380",
      website: "waterfronttz.com",
      hours: "12:00 PM - 11:00 PM",
      location: "Coco Beach, Dar es Salaam",
      priceRange: "TZS 25,000 - 80,000",
      specialBadge: { text: "Top Rated", color: "yellow", icon: "⭐" },
      badges: [
        { text: "Beach View", color: "blue", icon: true },
        { text: "Live Music", color: "purple", icon: false },
        { text: "Reservations Only", color: "orange", icon: false }
      ]
    },
    {
      id: 4,
      name: "Karambezi Café",
      cuisine: "Seafood • Swahili • Coastal Cuisine",
      rating: 4.6,
      reviews: "2.5k",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
      deliveryTime: "35-45 min",
      distance: "12.5 km",
      minOrder: "20,000",
      phone: "+255 777 415 175",
      website: "karambezi.co.tz",
      hours: "11:00 AM - 10:00 PM",
      location: "Sea Cliff, Dar es Salaam",
      priceRange: "TZS 18,000 - 55,000",
      specialBadge: undefined,
      badges: [
        { text: "Cliff-top Views", color: "blue", icon: true },
        { text: "Fresh Catch Daily", color: "green", icon: false }
      ]
    },
    {
      id: 5,
      name: "Khan's BBQ",
      cuisine: "Pakistani • Indian • BBQ • Halal",
      rating: 4.7,
      reviews: "3.6k",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      deliveryTime: "15-25 min",
      distance: "1.5 km",
      minOrder: "10,000",
      phone: "+255 22 211 8487",
      website: "khansbbq.co.tz",
      hours: "11:30 AM - 11:00 PM",
      location: "Upanga, Dar es Salaam",
      priceRange: "TZS 8,000 - 30,000",
      specialBadge: { text: "Fast Delivery", color: "green", icon: "⚡" },
      badges: [
        { text: "Free Delivery", color: "green", icon: true },
        { text: "Family Packs", color: "orange", icon: false },
        { text: "20% Off Pickup", color: "yellow", icon: false }
      ]
    },
    {
      id: 6,
      name: "Chapan Bhog",
      cuisine: "Indian • Vegetarian • South Indian",
      rating: 4.8,
      reviews: "2.9k",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
      deliveryTime: "20-30 min",
      distance: "3.2 km",
      minOrder: "12,000",
      phone: "+255 22 211 6645",
      website: "chapanbhog.co.tz",
      hours: "11:00 AM - 10:00 PM",
      location: "Kariakoo, Dar es Salaam",
      priceRange: "TZS 6,000 - 25,000",
      specialBadge: { text: "Vegetarian", color: "green", icon: "🌱" },
      badges: [
        { text: "100% Veg", color: "green", icon: true },
        { text: "Lunch Buffet", color: "orange", icon: false }
      ]
    },
    {
      id: 7,
      name: "Mediterraneo Restaurant",
      cuisine: "Italian • Mediterranean • Pizza",
      rating: 4.7,
      reviews: "3.4k",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      deliveryTime: "25-35 min",
      distance: "4.8 km",
      minOrder: "18,000",
      phone: "+255 22 260 1198",
      website: "mediterraneo.co.tz",
      hours: "12:00 PM - 11:00 PM",
      location: "Masaki, Dar es Salaam",
      priceRange: "TZS 15,000 - 50,000",
      specialBadge: undefined,
      badges: [
        { text: "Wood-fired Pizza", color: "orange", icon: true },
        { text: "Outdoor Seating", color: "blue", icon: false }
      ]
    },
    {
      id: 8,
      name: "Nawabi Khana",
      cuisine: "Mughlai • Indian • Biryani • Halal",
      rating: 4.6,
      reviews: "2.1k",
      image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80",
      deliveryTime: "20-30 min",
      distance: "2.8 km",
      minOrder: "15,000",
      phone: "+255 22 266 6687",
      website: "nawabikhana.co.tz",
      hours: "11:00 AM - 11:00 PM",
      location: "Oysterbay, Dar es Salaam",
      priceRange: "TZS 10,000 - 40,000",
      specialBadge: { text: "Biryani Specialist", color: "orange", icon: "🍛" },
      badges: [
        { text: "Party Orders", color: "purple", icon: true },
        { text: "15% Off Today", color: "yellow", icon: false }
      ]
    }
  ];

  const badgeColors = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-500 text-white"
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg">Restaurants in Dar es Salaam</h3>
          <p className="text-xs text-gray-500">{restaurants.length} restaurants • All open now</p>
        </div>
        <button 
          onClick={() => onNavigate('restaurants')}
          className="text-green-600 text-sm hover:text-green-700 transition-colors"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {restaurants.slice(0, 4).map((restaurant) => {
          const isExpanded = expandedRestaurants.includes(restaurant.id);
          
          return (
            <div key={restaurant.id} className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
              {/* Restaurant Image */}
              <div className="relative h-48">
                <img 
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Open Now
                </div>
                
                {/* Rating Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 text-xs px-3 py-1.5 rounded-full font-medium shadow-lg flex items-center gap-1">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  {restaurant.rating} ({restaurant.reviews})
                </div>
                
                {/* Special Badge */}
                {restaurant.specialBadge && (
                  <div className={`absolute bottom-3 left-3 ${badgeColors[restaurant.specialBadge.color as keyof typeof badgeColors]} text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg backdrop-blur-sm`}>
                    {restaurant.specialBadge.icon} {restaurant.specialBadge.text}
                  </div>
                )}
              </div>

              {/* Restaurant Content */}
              <div className="p-5">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-lg mb-1">{restaurant.name}</h4>
                      <p className="text-xs text-gray-600 mb-1">{restaurant.cuisine}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="size-3" />
                        {restaurant.location}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleRestaurant(restaurant.id)}
                      className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label={isExpanded ? "Show less" : "Show more"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="size-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  
                  {/* Quick Info - Always Visible */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3 bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-green-600" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-green-600" />
                      <span>{restaurant.distance}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-700">{restaurant.priceRange}</span>
                  </div>

                  {/* Badges - Always Visible */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {restaurant.badges.map((badge, index) => (
                      <div 
                        key={index} 
                        className={`${badgeColors[badge.color as keyof typeof badgeColors]} text-xs px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap`}
                      >
                        {badge.icon && <Bike className="size-3 flex-shrink-0" />}
                        <span>{badge.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                      {/* Contact Info */}
                      <div className="bg-gray-50 rounded-xl p-3 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="size-4 text-green-600 flex-shrink-0" />
                          <a 
                            href={`tel:${restaurant.phone.replace(/\s/g, '')}`} 
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {restaurant.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Globe className="size-4 text-green-600 flex-shrink-0" />
                          <a 
                            href={`https://${restaurant.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline break-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {restaurant.website}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="size-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">Hours: {restaurant.hours}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-600">Minimum Order: <span className="text-gray-900">TZS {restaurant.minOrder}</span></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show More/Less Text */}
                  {!isExpanded && (
                    <button
                      onClick={() => toggleRestaurant(restaurant.id)}
                      className="text-xs text-green-600 hover:text-green-700 transition-colors"
                    >
                      View contact & hours →
                    </button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => onNavigate('restaurants')}
                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <Utensils className="size-4" />
                    <span className="text-sm">Reserve Table</span>
                  </button>
                  <button 
                    onClick={() => onNavigate('gofood')}
                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <ShoppingBag className="size-4" />
                    <span className="text-sm">Order Delivery</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* View All Button */}
        <button
          onClick={() => onNavigate('restaurants')}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98"
        >
          <span>Explore All {restaurants.length} Restaurants</span>
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
