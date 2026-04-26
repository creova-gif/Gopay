import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User } from '../App';
import { projectId } from '../utils/supabase/info';
import {
  ArrowLeft, MapPin, Calendar, Users, Sparkles, ChevronRight,
  Mountain, Compass, Camera, Star, Shield, Clock, Heart,
  Search, Info, Check, Filter, Award, Zap, TrendingUp,
  Trees, Fish, Bird, Tent, Bike, Plane, Car, Palmtree, Sun, X
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GoSafariPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type Circuit = 'all' | 'northern' | 'southern' | 'western' | 'island' | 'other';

interface Park {
  id: string;
  name: string;
  circuit: Circuit;
  region: string;
  description: string;
  famousFor: string;
  highlights: string[];
  wildlife: string[];
  bestTime: string;
  citizenFee: number; // Tanzanian citizen fee
  residentFee: number; // East African resident fee
  nonResidentFee: number; // International visitor fee
  image: string;
  activities: string[];
  accommodation: string[];
  accessibility: 'Easy' | 'Moderate' | 'Challenging';
  size: string;
  established: string;
  nearestTown: string;
  distance: string;
  rating: number;
  reviews: number;
  promoted?: boolean;
  localDiscount?: number;
}

export function GoSafariPage({ user, accessToken, onBack }: GoSafariPageProps) {
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [travelers, setTravelers] = useState(2);
  const [selectedDate, setSelectedDate] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price' | 'nearest'>('popular');
  const [showPinModal, setShowPinModal] = useState(false);
  const [safariPin, setSafariPin] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [booked, setBooked] = useState(false);

  const handleBookSafari = () => {
    if (!selectedDate) {
      toast.error('Please select a travel date');
      return;
    }
    setShowPinModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedPark || safariPin.length !== 4) return;
    setBooking(true);
    try {
      const fee = user?.nida ? selectedPark.citizenFee : selectedPark.nonResidentFee;
      const total = fee * travelers;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/travel/parks/book`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({
            park: selectedPark.id,
            package: 'day-visit',
            date: selectedDate,
            visitors: travelers,
            visitorName: user?.name || '',
            visitorPhone: user?.phone || '',
            nationality: user?.nida ? 'TZ' : 'international',
            total,
            pin: safariPin,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Uhifadhi umeshindwa. Jaribu tena.');
        setBooking(false);
        return;
      }
      setBookingRef(data.reference || `TANAPA-${Date.now()}`);
      setBooked(true);
      setShowPinModal(false);
      setSafariPin('');
    } catch {
      toast.error('Hitilafu ya mtandao. Jaribu tena.');
    } finally {
      setBooking(false);
    }
  };

  const circuits = [
    { id: 'all', name: 'All Parks', icon: MapPin, description: 'Explore all Tanzania national parks' },
    { id: 'northern', name: 'Northern Circuit', icon: Mountain, description: 'Serengeti, Ngorongoro, Kilimanjaro' },
    { id: 'southern', name: 'Southern Circuit', icon: Trees, description: 'Nyerere, Ruaha, Mikumi' },
    { id: 'western', name: 'Western Circuit', icon: Fish, description: 'Gombe, Katavi, Mahale' },
    { id: 'island', name: 'Island Parks', icon: Palmtree, description: 'Lake Victoria islands' },
    { id: 'other', name: 'Hidden Gems', icon: Sparkles, description: 'Lesser-known treasures' }
  ];

  // COMPLETE LIST OF ALL TANZANIA NATIONAL PARKS
  const nationalParks: Park[] = [
    // NORTHERN CIRCUIT - Most Popular
    {
      id: 'serengeti',
      name: 'Serengeti National Park',
      circuit: 'northern',
      region: 'Mara & Simiyu',
      description: 'Witness the greatest wildlife spectacle on Earth - the Great Wildebeest Migration',
      famousFor: 'Great Migration of 1.5 million wildebeest',
      highlights: ['Great Migration', 'Big Five', 'Endless Plains', 'Hot Air Balloon Safaris', 'Maasai Culture'],
      wildlife: ['Lions', 'Elephants', 'Leopards', 'Cheetahs', 'Wildebeest', 'Zebras', 'Giraffes', 'Hyenas'],
      bestTime: 'June - October (Migration), December - March (Calving)',
      citizenFee: 30000,
      residentFee: 50000,
      nonResidentFee: 200000,
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      activities: ['Game Drives', 'Hot Air Balloon Safari', 'Walking Safari', 'Photography Tours', 'Cultural Visits'],
      accommodation: ['Luxury Lodges', 'Tented Camps', 'Mobile Camps', 'Public Campsites'],
      accessibility: 'Moderate',
      size: '14,763 km²',
      established: '1951',
      nearestTown: 'Arusha',
      distance: '335 km from Arusha',
      rating: 4.9,
      reviews: 15234,
      promoted: true,
      localDiscount: 20
    },
    {
      id: 'ngorongoro',
      name: 'Ngorongoro Conservation Area',
      circuit: 'northern',
      region: 'Arusha',
      description: 'UNESCO World Heritage Site with the world\'s largest intact volcanic crater',
      famousFor: 'World\'s largest volcanic crater & highest density of predators',
      highlights: ['Crater Floor Safari', 'Big Five', 'Olduvai Gorge', 'Maasai Villages', 'Spectacular Views'],
      wildlife: ['Black Rhinos', 'Lions', 'Elephants', 'Buffalos', 'Hippos', 'Flamingos', 'Leopards'],
      bestTime: 'Year-round (Dry season: June - October)',
      citizenFee: 25000,
      residentFee: 45000,
      nonResidentFee: 180000,
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
      activities: ['Crater Game Drives', 'Cultural Tours', 'Walking Safari', 'Olduvai Gorge Visit', 'Bird Watching'],
      accommodation: ['Crater Rim Lodges', 'Luxury Camps', 'Budget Campsites'],
      accessibility: 'Easy',
      size: '8,292 km²',
      established: '1959',
      nearestTown: 'Arusha',
      distance: '180 km from Arusha',
      rating: 4.9,
      reviews: 13567,
      promoted: true,
      localDiscount: 20
    },
    {
      id: 'tarangire',
      name: 'Tarangire National Park',
      circuit: 'northern',
      region: 'Manyara',
      description: 'Giant baobabs and massive elephant herds in a beautiful landscape',
      famousFor: 'Largest elephant population in Tanzania & ancient baobab trees',
      highlights: ['Elephant Herds', 'Baobab Trees', 'Tree-Climbing Lions', 'Tarangire River', 'Bird Paradise'],
      wildlife: ['Elephants', 'Lions', 'Leopards', 'Buffalos', 'Zebras', 'Wildebeest', 'Pythons', 'Over 550 bird species'],
      bestTime: 'June - October (Dry season for wildlife concentration)',
      citizenFee: 20000,
      residentFee: 35000,
      nonResidentFee: 150000,
      image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800',
      activities: ['Game Drives', 'Walking Safari', 'Bird Watching', 'Night Game Drives', 'Photography'],
      accommodation: ['Lodges', 'Tented Camps', 'Public Campsites'],
      accessibility: 'Easy',
      size: '2,850 km²',
      established: '1970',
      nearestTown: 'Arusha',
      distance: '118 km from Arusha',
      rating: 4.7,
      reviews: 8934,
      promoted: true,
      localDiscount: 15
    },
    {
      id: 'lake-manyara',
      name: 'Lake Manyara National Park',
      circuit: 'northern',
      region: 'Arusha',
      description: 'Diverse ecosystems from alkaline lake to dense forest and cliff-hanging trees',
      famousFor: 'Tree-climbing lions & millions of pink flamingos',
      highlights: ['Tree-Climbing Lions', 'Flamingos', 'Hot Springs', 'Canopy Walkway', 'Rift Valley Views'],
      wildlife: ['Tree-Climbing Lions', 'Elephants', 'Hippos', 'Buffalos', 'Baboons', 'Flamingos', 'Pelicans'],
      bestTime: 'June - October & January - February',
      citizenFee: 20000,
      residentFee: 35000,
      nonResidentFee: 150000,
      image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=800',
      activities: ['Game Drives', 'Canopy Walk', 'Canoeing', 'Mountain Biking', 'Cultural Tours'],
      accommodation: ['Lodges', 'Camps', 'Campsites'],
      accessibility: 'Easy',
      size: '330 km²',
      established: '1960',
      nearestTown: 'Arusha',
      distance: '126 km from Arusha',
      rating: 4.6,
      reviews: 7234,
      localDiscount: 15
    },
    {
      id: 'arusha',
      name: 'Arusha National Park',
      circuit: 'northern',
      region: 'Arusha',
      description: 'Small but diverse park with Mount Meru, Momella Lakes, and Ngurdoto Crater',
      famousFor: 'Mount Meru climbing & close proximity to Arusha city',
      highlights: ['Mount Meru', 'Momella Lakes', 'Ngurdoto Crater', 'Colobus Monkeys', 'Flamingos'],
      wildlife: ['Giraffes', 'Buffalos', 'Colobus Monkeys', 'Flamingos', 'Leopards', 'Hyenas', 'Over 400 bird species'],
      bestTime: 'June - October & December - February',
      citizenFee: 15000,
      residentFee: 30000,
      nonResidentFee: 120000,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      activities: ['Mount Meru Climbing', 'Walking Safari', 'Canoeing', 'Game Drives', 'Bird Watching'],
      accommodation: ['Lodges', 'Campsites on Mount Meru'],
      accessibility: 'Easy',
      size: '552 km²',
      established: '1960',
      nearestTown: 'Arusha',
      distance: '32 km from Arusha',
      rating: 4.5,
      reviews: 5678,
      localDiscount: 10
    },
    {
      id: 'kilimanjaro',
      name: 'Kilimanjaro National Park',
      circuit: 'northern',
      region: 'Kilimanjaro',
      description: 'Home to Africa\'s highest peak - the majestic Mount Kilimanjaro',
      famousFor: 'Africa\'s highest mountain at 5,895m - Roof of Africa',
      highlights: ['Summit Uhuru Peak', 'Seven Climbing Routes', 'Glaciers', 'Alpine Desert', 'Stunning Sunrise'],
      wildlife: ['Blue Monkeys', 'Colobus Monkeys', 'Elephants', 'Leopards', 'Buffalos', 'Elands', 'Duikers'],
      bestTime: 'January - March & June - October',
      citizenFee: 25000,
      residentFee: 45000,
      nonResidentFee: 200000,
      image: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=800',
      activities: ['Mountain Climbing', 'Trekking', 'Day Hikes', 'Photography', 'Cultural Tours'],
      accommodation: ['Mountain Huts', 'Camping', 'Hotels in Moshi'],
      accessibility: 'Challenging',
      size: '1,688 km²',
      established: '1973',
      nearestTown: 'Moshi',
      distance: '128 km from Arusha',
      rating: 4.9,
      reviews: 18945,
      promoted: true
    },

    // SOUTHERN CIRCUIT
    {
      id: 'nyerere',
      name: 'Nyerere National Park',
      circuit: 'southern',
      region: 'Pwani, Morogoro, Ruvuma, Lindi',
      description: 'Tanzania\'s largest national park with pristine wilderness and boat safaris',
      famousFor: 'Largest national park in Tanzania & boat safaris on Rufiji River',
      highlights: ['Boat Safaris', 'Walking Safari', 'Wild Dogs', 'Pristine Wilderness', 'Rufiji River'],
      wildlife: ['Wild Dogs', 'Elephants', 'Lions', 'Buffalos', 'Hippos', 'Crocodiles', 'Over 440 bird species'],
      bestTime: 'June - October (Dry season)',
      citizenFee: 25000,
      residentFee: 40000,
      nonResidentFee: 180000,
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
      activities: ['Boat Safari', 'Walking Safari', 'Game Drives', 'Fishing', 'Bird Watching'],
      accommodation: ['Luxury Camps', 'Standard Camps', 'Campsites'],
      accessibility: 'Moderate',
      size: '30,893 km²',
      established: '2019 (formerly Selous Game Reserve)',
      nearestTown: 'Dar es Salaam',
      distance: '230 km from Dar es Salaam',
      rating: 4.8,
      reviews: 4567,
      promoted: true,
      localDiscount: 25
    },
    {
      id: 'ruaha',
      name: 'Ruaha National Park',
      circuit: 'southern',
      region: 'Iringa',
      description: 'Tanzania\'s second-largest park with spectacular baobabs and diverse wildlife',
      famousFor: 'High concentration of elephants & rare species',
      highlights: ['Large Elephant Herds', 'Ruaha River', 'Baobab Trees', 'Wild Dogs', 'Remote Wilderness'],
      wildlife: ['Elephants', 'Lions', 'Leopards', 'Cheetahs', 'Wild Dogs', 'Greater & Lesser Kudu', 'Roan & Sable Antelopes'],
      bestTime: 'June - October',
      citizenFee: 25000,
      residentFee: 40000,
      nonResidentFee: 180000,
      image: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=800',
      activities: ['Game Drives', 'Walking Safari', 'Bird Watching', 'Photography', 'Fly Camping'],
      accommodation: ['Luxury Lodges', 'Tented Camps', 'Public Campsites'],
      accessibility: 'Moderate',
      size: '20,226 km²',
      established: '1964',
      nearestTown: 'Iringa',
      distance: '130 km from Iringa',
      rating: 4.7,
      reviews: 3456,
      localDiscount: 20
    },
    {
      id: 'mikumi',
      name: 'Mikumi National Park',
      circuit: 'southern',
      region: 'Morogoro',
      description: 'Fourth-largest park with easy wildlife viewing along the Dar-Iringa highway',
      famousFor: 'Easy accessibility from Dar es Salaam & high predator density',
      highlights: ['Easy Wildlife Viewing', 'Mkata Floodplain', 'Lions', 'Hippo Pools', 'Accessible Safari'],
      wildlife: ['Lions', 'Elephants', 'Buffalos', 'Zebras', 'Giraffes', 'Hippos', 'Wild Dogs', 'Over 400 bird species'],
      bestTime: 'June - October',
      citizenFee: 20000,
      residentFee: 35000,
      nonResidentFee: 150000,
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      activities: ['Game Drives', 'Walking Safari', 'Bird Watching', 'Photography'],
      accommodation: ['Lodges', 'Camps', 'Public Campsites'],
      accessibility: 'Easy',
      size: '3,230 km²',
      established: '1964',
      nearestTown: 'Morogoro',
      distance: '283 km from Dar es Salaam',
      rating: 4.5,
      reviews: 4123,
      promoted: true,
      localDiscount: 15
    },

    // WESTERN CIRCUIT
    {
      id: 'gombe',
      name: 'Gombe Stream National Park',
      circuit: 'western',
      region: 'Kigoma',
      description: 'World-famous for chimpanzee research by Dr. Jane Goodall',
      famousFor: 'Chimpanzee trekking & Jane Goodall research',
      highlights: ['Chimpanzee Trekking', 'Jane Goodall Legacy', 'Lake Tanganyika', 'Primate Research', 'Forest Hikes'],
      wildlife: ['Chimpanzees', 'Red Colobus Monkeys', 'Red-Tailed Monkeys', 'Baboons', 'Bushbucks', 'Over 200 bird species'],
      bestTime: 'May - October (Dry season)',
      citizenFee: 30000,
      residentFee: 50000,
      nonResidentFee: 200000,
      image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800',
      activities: ['Chimpanzee Trekking', 'Forest Hiking', 'Swimming in Lake Tanganyika', 'Bird Watching', 'Snorkeling'],
      accommodation: ['Gombe Forest Lodge', 'Kasekela Campsite'],
      accessibility: 'Moderate',
      size: '52 km²',
      established: '1968',
      nearestTown: 'Kigoma',
      distance: '16 km north of Kigoma (boat access)',
      rating: 4.8,
      reviews: 2345
    },
    {
      id: 'katavi',
      name: 'Katavi National Park',
      circuit: 'western',
      region: 'Katavi',
      description: 'Remote and wild park with massive buffalo herds and seasonal floodplains',
      famousFor: 'Tanzania\'s best-kept secret with huge buffalo & hippo concentrations',
      highlights: ['Remote Wilderness', 'Huge Buffalo Herds', 'Hippo Pools', 'Katuma River', 'Unspoiled Nature'],
      wildlife: ['Buffalos', 'Hippos', 'Crocodiles', 'Elephants', 'Lions', 'Leopards', 'Giraffes', 'Zebras'],
      bestTime: 'June - October',
      citizenFee: 25000,
      residentFee: 40000,
      nonResidentFee: 180000,
      image: 'https://images.unsplash.com/photo-1551558524-7c4c99bc2c07?w=800',
      activities: ['Game Drives', 'Walking Safari', 'Fly Camping', 'Bird Watching', 'Photography'],
      accommodation: ['Luxury Camps', 'Budget Camps'],
      accessibility: 'Challenging',
      size: '4,471 km²',
      established: '1974',
      nearestTown: 'Mpanda',
      distance: '40 km from Mpanda',
      rating: 4.7,
      reviews: 1234,
      localDiscount: 30
    },
    {
      id: 'mahale',
      name: 'Mahale Mountains National Park',
      circuit: 'western',
      region: 'Kigoma',
      description: 'Stunning mountainous terrain with wild chimpanzees on Lake Tanganyika shores',
      famousFor: 'Wild chimpanzee trekking in pristine mountains',
      highlights: ['Chimpanzee Trekking', 'Lake Tanganyika Beaches', 'Mountain Hiking', 'Crystal Waters', 'Remote Paradise'],
      wildlife: ['Chimpanzees', 'Red Colobus Monkeys', 'Blue Monkeys', 'Bushbucks', 'Over 350 bird species'],
      bestTime: 'May - October',
      citizenFee: 30000,
      residentFee: 50000,
      nonResidentFee: 200000,
      image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800',
      activities: ['Chimpanzee Trekking', 'Snorkeling', 'Kayaking', 'Mountain Hiking', 'Beach Relaxation'],
      accommodation: ['Luxury Camps (boat access only)'],
      accessibility: 'Challenging',
      size: '1,613 km²',
      established: '1985',
      nearestTown: 'Kigoma',
      distance: '150 km south of Kigoma (boat access)',
      rating: 4.9,
      reviews: 1567,
      localDiscount: 25
    },

    // ISLAND PARKS
    {
      id: 'rubondo',
      name: 'Rubondo Island National Park',
      circuit: 'island',
      region: 'Geita',
      description: 'Pristine island sanctuary on Lake Victoria with unique wildlife',
      famousFor: 'Island sanctuary for chimpanzees & rare sitatunga antelopes',
      highlights: ['Chimpanzee Tracking', 'Bird Watching', 'Fishing', 'Island Exploration', 'Sitatunga Antelope'],
      wildlife: ['Chimpanzees', 'Sitatunga', 'Elephants', 'Giraffes', 'Hippos', 'Crocodiles', 'Over 400 bird species'],
      bestTime: 'June - October',
      citizenFee: 20000,
      residentFee: 35000,
      nonResidentFee: 150000,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      activities: ['Chimpanzee Tracking', 'Sport Fishing', 'Bird Watching', 'Nature Walks', 'Canoeing'],
      accommodation: ['Rubondo Island Camp', 'Campsites'],
      accessibility: 'Moderate',
      size: '457 km²',
      established: '1977',
      nearestTown: 'Geita',
      distance: 'Boat access from Nkome (3-4 hours)',
      rating: 4.6,
      reviews: 876,
      localDiscount: 20
    },
    {
      id: 'saanane',
      name: 'Saanane Island National Park',
      circuit: 'island',
      region: 'Mwanza',
      description: 'Tanzania\'s smallest national park - perfect for Mwanza city residents',
      famousFor: 'Tanzania\'s first island national park & urban wildlife sanctuary',
      highlights: ['City Escape', 'Boat Rides', 'Picnic Spots', 'Rock Hyrax', 'Lake Victoria Views'],
      wildlife: ['Impalas', 'Rock Hyrax', 'Velvet Monkeys', 'Tortoises', 'Monitor Lizards', 'Over 50 bird species'],
      bestTime: 'Year-round',
      citizenFee: 8000,
      residentFee: 15000,
      nonResidentFee: 50000,
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      activities: ['Game Viewing', 'Boat Rides', 'Picnicking', 'Rock Climbing', 'Photography'],
      accommodation: ['Day trips only', 'Hotels in Mwanza'],
      accessibility: 'Easy',
      size: '2.18 km²',
      established: '2013',
      nearestTown: 'Mwanza City',
      distance: '2 km from Mwanza city center (boat access)',
      rating: 4.3,
      reviews: 1234,
      promoted: true,
      localDiscount: 10
    },

    // OTHER NATIONAL PARKS - Hidden Gems
    {
      id: 'kitulo',
      name: 'Kitulo National Park',
      circuit: 'other',
      region: 'Mbeya',
      description: 'The "Garden of God" - botanical wonderland with rare orchids and wildflowers',
      famousFor: 'Spectacular wildflower displays & rare orchids',
      highlights: ['Wildflower Blooms', 'Rare Orchids', 'Mountain Scenery', 'Hiking Trails', 'Endemic Species'],
      wildlife: ['Mountain Reedbuck', 'Eland', 'Southern Reedbuck', 'Blue Monkeys', 'Over 400 bird species'],
      bestTime: 'December - April (Wildflower season)',
      citizenFee: 15000,
      residentFee: 25000,
      nonResidentFee: 100000,
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
      activities: ['Wildflower Viewing', 'Hiking', 'Mountain Biking', 'Bird Watching', 'Photography'],
      accommodation: ['Campsites', 'Cottages in Matamba'],
      accessibility: 'Moderate',
      size: '413 km²',
      established: '2005',
      nearestTown: 'Mbeya',
      distance: '100 km from Mbeya',
      rating: 4.7,
      reviews: 567,
      localDiscount: 20
    },
    {
      id: 'mkomazi',
      name: 'Mkomazi National Park',
      circuit: 'other',
      region: 'Kilimanjaro & Tanga',
      description: 'Semi-arid savanna with spectacular views of Kilimanjaro and Usambara Mountains',
      famousFor: 'Black rhino sanctuary & wild dog conservation',
      highlights: ['Black Rhinos', 'Wild Dogs', 'Kilimanjaro Views', 'Usambara Mountains', 'Dry Savanna'],
      wildlife: ['Black Rhinos', 'Wild Dogs', 'Elephants', 'Giraffes', 'Oryx', 'Gerenuk', 'Over 450 bird species'],
      bestTime: 'June - February',
      citizenFee: 20000,
      residentFee: 35000,
      nonResidentFee: 150000,
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
      activities: ['Game Drives', 'Rhino Tracking', 'Bird Watching', 'Walking Safari', 'Photography'],
      accommodation: ['Camps', 'Campsites'],
      accessibility: 'Moderate',
      size: '3,245 km²',
      established: '2008',
      nearestTown: 'Same',
      distance: '112 km from Moshi',
      rating: 4.4,
      reviews: 789,
      localDiscount: 15
    },
    {
      id: 'udzungwa',
      name: 'Udzungwa Mountains National Park',
      circuit: 'other',
      region: 'Morogoro',
      description: 'Biodiversity hotspot with unique primates, waterfalls, and mountain forests',
      famousFor: 'Endemic primates & spectacular waterfalls',
      highlights: ['Sanje Waterfall', 'Endemic Monkeys', 'Mountain Hiking', 'Biodiversity', 'Forest Trails'],
      wildlife: ['Iringa Red Colobus', 'Sanje Crested Mangabey', 'Elephants', 'Buffalos', 'Over 400 bird species'],
      bestTime: 'June - October',
      citizenFee: 20000,
      residentFee: 35000,
      nonResidentFee: 150000,
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800',
      activities: ['Waterfall Hiking', 'Primate Tracking', 'Bird Watching', 'Forest Walks', 'Photography'],
      accommodation: ['Guesthouses in Mang\'ula', 'Campsites'],
      accessibility: 'Moderate',
      size: '1,990 km²',
      established: '1992',
      nearestTown: 'Mikumi',
      distance: '65 km from Mikumi',
      rating: 4.6,
      reviews: 1123,
      localDiscount: 15
    },
    {
      id: 'saadani',
      name: 'Saadani National Park',
      circuit: 'other',
      region: 'Pwani',
      description: 'Tanzania\'s only coastal national park where the beach meets the bush',
      famousFor: 'Only park where beach meets bush - unique coastal safari',
      highlights: ['Beach & Bush', 'Boat Safaris', 'Indian Ocean', 'Wami River', 'Unique Ecosystem'],
      wildlife: ['Lions', 'Elephants', 'Buffalos', 'Hippos', 'Crocodiles', 'Green Turtles', 'Dolphins'],
      bestTime: 'June - October',
      citizenFee: 20000,
      residentFee: 35000,
      nonResidentFee: 150000,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      activities: ['Game Drives', 'Boat Safari', 'Beach Walks', 'Fishing', 'Turtle Watching'],
      accommodation: ['Beach Lodges', 'Tented Camps', 'Campsites'],
      accessibility: 'Moderate',
      size: '1,100 km²',
      established: '2005',
      nearestTown: 'Bagamoyo',
      distance: '130 km north of Dar es Salaam',
      rating: 4.5,
      reviews: 2345,
      promoted: true,
      localDiscount: 20
    },
    {
      id: 'burigi-chato',
      name: 'Burigi-Chato National Park',
      circuit: 'other',
      region: 'Kagera',
      description: 'One of Tanzania\'s newest parks with diverse landscapes and wildlife',
      famousFor: 'New park (2019) with pristine wilderness & migratory species',
      highlights: ['Pristine Wilderness', 'Lake Systems', 'Migratory Wildlife', 'Less Crowded', 'New Discovery'],
      wildlife: ['Elephants', 'Buffalos', 'Giraffes', 'Zebras', 'Topi', 'Roan Antelopes', 'Over 300 bird species'],
      bestTime: 'June - October',
      citizenFee: 15000,
      residentFee: 30000,
      nonResidentFee: 120000,
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      activities: ['Game Drives', 'Bird Watching', 'Nature Walks', 'Photography', 'Cultural Tours'],
      accommodation: ['Limited camps', 'Campsites'],
      accessibility: 'Moderate',
      size: '4,707 km²',
      established: '2019',
      nearestTown: 'Biharamulo',
      distance: '200 km from Bukoba',
      rating: 4.2,
      reviews: 234,
      localDiscount: 25
    },
    {
      id: 'ibanda-kyerwa',
      name: 'Ibanda-Kyerwa National Park',
      circuit: 'other',
      region: 'Kagera',
      description: 'Tanzania\'s newest national park with unique Kagera region biodiversity',
      famousFor: 'Newest park (2019) in northwestern Tanzania',
      highlights: ['New Park', 'Unique Ecosystems', 'Less Explored', 'Wildlife Corridors', 'Adventure'],
      wildlife: ['Elephants', 'Buffalos', 'Zebras', 'Topi', 'Reedbucks', 'Sitatunga', 'Various bird species'],
      bestTime: 'June - October',
      citizenFee: 15000,
      residentFee: 30000,
      nonResidentFee: 120000,
      image: 'https://images.unsplash.com/photo-1551558524-7c4c99bc2c07?w=800',
      activities: ['Game Drives', 'Nature Walks', 'Bird Watching', 'Cultural Experiences', 'Photography'],
      accommodation: ['Basic camps', 'Campsites'],
      accessibility: 'Moderate',
      size: '200 km²',
      established: '2019',
      nearestTown: 'Kyerwa',
      distance: '180 km from Bukoba',
      rating: 4.1,
      reviews: 156,
      localDiscount: 30
    }
  ];

  const filteredParks = nationalParks.filter(park => {
    const matchesCircuit = selectedCircuit === 'all' || park.circuit === selectedCircuit;
    const matchesSearch = park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         park.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         park.famousFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         park.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCircuit && matchesSearch;
  });

  const sortedParks = [...filteredParks].sort((a, b) => {
    if (sortBy === 'popular') return b.rating - a.rating;
    if (sortBy === 'price') return a.citizenFee - b.citizenFee;
    return 0;
  });

  const toggleFavorite = (parkId: string) => {
    if (favorites.includes(parkId)) {
      setFavorites(favorites.filter(id => id !== parkId));
    } else {
      setFavorites([...favorites, parkId]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const ParkCard = ({ park }: { park: Park }) => (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border cursor-pointer"
      onClick={() => setSelectedPark(park)}
    >
      {/* Image */}
      <div className="relative h-48">
        <ImageWithFallback
          src={park.image}
          alt={park.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {park.promoted && (
            <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3" />
              Promoted
            </div>
          )}
          {park.localDiscount && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {park.localDiscount}% OFF Citizens
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-sm">{park.rating}</span>
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(park.id);
          }}
          className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              favorites.includes(park.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-1 text-gray-900">{park.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-800 mb-2 font-medium">
              <MapPin className="w-4 h-4" />
              <span>{park.region}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-800 mb-3 line-clamp-2 font-medium">{park.famousFor}</p>

        {/* Info Pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded text-sm font-bold">
            {park.size}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded text-sm font-bold">
            {park.accessibility}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-sm text-gray-700 font-medium">Tanzanian Citizens</p>
            <p className="font-bold text-xl text-[#1a5f3f]">{formatCurrency(park.citizenFee)}</p>
          </div>
          <Button size="sm" className="bg-[#1a5f3f] hover:bg-[#164d33]">
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (selectedPark) {
    const estimatedCost = (selectedPark.citizenFee * travelers) + (travelers * 150000); // Park fee + estimated accommodation/transport

    return (
      <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="relative h-80">
          <ImageWithFallback
            src={selectedPark.image}
            alt={selectedPark.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedPark(null)}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <button
            onClick={() => toggleFavorite(selectedPark.id)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2"
          >
            <Heart
              className={`w-5 h-5 ${
                favorites.includes(selectedPark.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>

          <div className="absolute bottom-6 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                {selectedPark.circuit.charAt(0).toUpperCase() + selectedPark.circuit.slice(1)} Circuit
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {selectedPark.rating}
              </div>
            </div>
            <h1 className="font-bold text-3xl mb-2">{selectedPark.name}</h1>
            <p className="text-lg opacity-95 mb-2">{selectedPark.region}</p>
            <p className="text-sm opacity-90">{selectedPark.famousFor}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Motivational Banner for Locals */}
          <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2a7f5f] text-white rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-xl mb-2">Discover Tanzania's Natural Treasures!</h2>
                <p className="opacity-95 mb-3">
                  As a Tanzanian citizen, explore your own backyard with special discounted rates. 
                  Visit at least one national park this year and create unforgettable memories!
                </p>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
                  <p className="text-sm font-semibold">🎉 Special Citizen Rate: {formatCurrency(selectedPark.citizenFee)} per person</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border">
              <Mountain className="w-8 h-8 text-[#1a5f3f] mb-2" />
              <p className="text-sm text-gray-600 mb-1">Park Size</p>
              <p className="font-bold">{selectedPark.size}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <MapPin className="w-8 h-8 text-[#1a5f3f] mb-2" />
              <p className="text-sm text-gray-600 mb-1">Distance</p>
              <p className="font-bold">{selectedPark.distance}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <Calendar className="w-8 h-8 text-[#1a5f3f] mb-2" />
              <p className="text-sm text-gray-600 mb-1">Best Time</p>
              <p className="font-bold text-sm">{selectedPark.bestTime}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <Shield className="w-8 h-8 text-[#1a5f3f] mb-2" />
              <p className="text-sm text-gray-600 mb-1">Established</p>
              <p className="font-bold">{selectedPark.established}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-6 border">
            <h2 className="font-bold text-xl mb-3">About This Park</h2>
            <p className="text-gray-700 leading-relaxed">{selectedPark.description}</p>
          </div>

          {/* Entry Fees */}
          <div className="bg-white rounded-xl p-6 border">
            <h2 className="font-bold text-xl mb-4">Entry Fees (Per Person, Per Day)</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">🇹🇿 Tanzanian Citizens</p>
                <p className="font-bold text-2xl text-[#1a5f3f]">{formatCurrency(selectedPark.citizenFee)}</p>
                {selectedPark.localDiscount && (
                  <p className="text-xs text-green-600 mt-1">Save {selectedPark.localDiscount}% with goPay!</p>
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">🌍 EAC Residents</p>
                <p className="font-bold text-2xl text-blue-700">{formatCurrency(selectedPark.residentFee)}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">✈️ International</p>
                <p className="font-bold text-2xl text-gray-700">{formatCurrency(selectedPark.nonResidentFee)}</p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-xl p-6 border">
            <h2 className="font-bold text-xl mb-4">Park Highlights</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {selectedPark.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wildlife */}
          <div className="bg-white rounded-xl p-6 border">
            <h2 className="font-bold text-xl mb-4">Wildlife You Can See</h2>
            <div className="flex flex-wrap gap-2">
              {selectedPark.wildlife.map((animal, index) => (
                <div key={index} className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {animal}
                </div>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-xl p-6 border">
            <h2 className="font-bold text-xl mb-4">Activities</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {selectedPark.activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Camera className="w-5 h-5 text-[#1a5f3f]" />
                  <span>{activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accommodation */}
          <div className="bg-white rounded-xl p-6 border">
            <h2 className="font-bold text-xl mb-4">Accommodation Options</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {selectedPark.accommodation.map((option, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                  <Tent className="w-5 h-5 text-[#1a5f3f]" />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Getting There */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="font-bold text-xl mb-4">Getting There</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-semibold">Nearest Town</p>
                  <p className="text-gray-700">{selectedPark.nearestTown}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-semibold">Distance</p>
                  <p className="text-gray-700">{selectedPark.distance}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-semibold">Accessibility</p>
                  <p className="text-gray-700">{selectedPark.accessibility} access - suitable for most travelers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="bg-white rounded-xl p-6 border">
            <h2 className="font-bold text-xl mb-4">Book Your Safari</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Number of Travelers</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-bold text-xl w-12 text-center">{travelers}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTravelers(travelers + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Travel Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Estimated Package Cost:</span>
                  <span className="font-bold text-2xl text-[#1a5f3f]">{formatCurrency(estimatedCost)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Includes: Park fees ({travelers} person{travelers > 1 ? 's' : ''}), accommodation, meals, and guided safari
                </p>
              </div>

              {booked ? (
                <div className="bg-green-50 border-2 border-green-400 rounded-xl p-5 text-center">
                  <Check className="w-10 h-10 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-green-900 text-lg">Uhifadhi Umekamilika!</p>
                  <p className="text-sm text-green-700 mt-1">Ref: {bookingRef}</p>
                  <p className="text-xs text-gray-500 mt-2">Uhifadhi umehifadhiwa kwenye akaunti yako. Angalia barua pepe yako.</p>
                  <Button onClick={() => { setBooked(false); setSelectedPark(null); }} className="mt-4 bg-[#1a5f3f] hover:bg-[#164d33] w-full">
                    Rudi kwa Mbuga
                  </Button>
                </div>
              ) : (
                <>
                  <Button onClick={handleBookSafari} className="w-full bg-[#1a5f3f] hover:bg-[#164d33] py-6 text-lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Safari Package - {formatCurrency(estimatedCost)}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    By booking, you agree to our terms. Free cancellation up to 48 hours before departure.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PIN confirmation modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setShowPinModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">Thibitisha Uhifadhi</h3>
              <button onClick={() => setShowPinModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-green-50 rounded-xl p-4 mb-5">
              <p className="text-sm text-gray-600 mb-1">{selectedPark?.name}</p>
              <p className="text-sm text-gray-600">{selectedDate} · {travelers} msafiri</p>
              <p className="text-xl font-bold text-[#1a5f3f] mt-2">{formatCurrency(estimatedCost)}</p>
            </div>
            <p className="text-sm text-gray-600 mb-3">Ingiza PIN yako kukubaliana na malipo:</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={safariPin}
              onChange={e => setSafariPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              className="w-32 border-2 rounded-xl px-4 py-3 text-center text-xl tracking-widest font-bold mb-5"
              style={{ borderColor: safariPin.length === 4 ? '#1a5f3f' : '#e5e7eb' }}
              autoFocus
            />
            <Button
              onClick={handleConfirmBooking}
              disabled={safariPin.length !== 4 || booking}
              className="w-full bg-[#1a5f3f] hover:bg-[#164d33] h-12 font-bold"
            >
              {booking ? 'Inaweka...' : 'Thibitisha Uhifadhi'}
            </Button>
          </div>
        </div>
      )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2a7f5f] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-bold text-3xl mb-2">GoSafari Tanzania</h1>
              <p className="text-sm opacity-90">Explore {nationalParks.length} National Parks & Game Reserves</p>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400 rounded-full p-3">
                <Mountain className="w-8 h-8 text-gray-900" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-xl mb-2">Discover Your Own Backyard! 🇹🇿</h2>
                <p className="opacity-95 mb-3">
                  As Tanzanians, we're blessed with some of the world's most incredible wildlife and landscapes. 
                  Many locals haven't explored our own natural treasures. This year, make it your goal to visit at least 
                  ONE national park and experience the magic of Tanzania!
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    ✨ Special Citizen Prices
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    🎯 Affordable Packages
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    🏞️ Unforgettable Memories
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search parks by name, region, or wildlife..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white h-14 text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Circuit Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {circuits.map(circuit => {
              const Icon = circuit.icon;
              return (
                <button
                  key={circuit.id}
                  onClick={() => setSelectedCircuit(circuit.id as Circuit)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCircuit === circuit.id
                      ? 'bg-[#1a5f3f] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold">{circuit.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sort & Filter */}
      <div className="max-w-7xl mx-auto px-4 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {sortedParks.length} park{sortedParks.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border rounded-lg text-sm bg-white text-gray-900 font-semibold"
            >
              <option value="popular">Most Popular</option>
              <option value="price">Lowest Price</option>
            </select>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Parks Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {sortedParks.length === 0 ? (
          <div className="text-center py-12">
            <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No parks found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedParks.map(park => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-bold text-2xl mb-3">🎯 Challenge: Visit One Park This Year!</h2>
          <p className="mb-6 text-lg">
            Join thousands of Tanzanians discovering their own country. Special citizen rates make it affordable for everyone!
          </p>
          <Button size="lg" className="bg-[#1a5f3f] hover:bg-[#164d33] text-white">
            <Sparkles className="w-5 h-5 mr-2" />
            Start Your Adventure
          </Button>
        </div>
      </div>
    </div>
  );
}
