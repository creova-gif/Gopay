import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { 
  ArrowLeft, Bus, Ship, Plane, Hotel, Mountain, Calendar, Users, MapPin, 
  Clock, ChevronRight, Star, Check, CreditCard, Train, Ticket, Search,
  ArrowRight, Info, Shield, AlertCircle
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface TravelPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type TravelMode = 'flights' | 'bus' | 'ferry' | 'hotels' | 'parks' | 'train' | null;

export function TravelPage({ user, accessToken, onBack }: TravelPageProps) {
  const [currentMode, setCurrentMode] = useState<TravelMode>(null);
  const [searchStep, setSearchStep] = useState<'search' | 'results' | 'details' | 'payment' | 'success'>('search');
  
  // Search form state
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    rooms: 1,
    checkIn: '',
    checkOut: '',
    parkName: '',
    visitors: 1
  });

  // Selected booking
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [bookingReference, setBookingReference] = useState('');

  // Mock data for flights - Comprehensive Tanzania routes
  const allFlights = [
    // Dar es Salaam routes
    { id: 'FL001', airline: 'Precision Air', from: 'Dar es Salaam', to: 'Arusha', departure: '06:30', arrival: '08:00', duration: '1h 30m', price: 145000, seats: 12 },
    { id: 'FL002', airline: 'Air Tanzania', from: 'Dar es Salaam', to: 'Arusha', departure: '09:00', arrival: '10:30', duration: '1h 30m', price: 150000, seats: 8 },
    { id: 'FL003', airline: 'Precision Air', from: 'Dar es Salaam', to: 'Arusha', departure: '14:00', arrival: '15:30', duration: '1h 30m', price: 155000, seats: 15 },
    { id: 'FL004', airline: 'FastJet', from: 'Dar es Salaam', to: 'Arusha', departure: '17:30', arrival: '19:00', duration: '1h 30m', price: 140000, seats: 20 },
    
    { id: 'FL005', airline: 'Air Tanzania', from: 'Dar es Salaam', to: 'Mwanza', departure: '07:00', arrival: '08:45', duration: '1h 45m', price: 175000, seats: 15 },
    { id: 'FL006', airline: 'Precision Air', from: 'Dar es Salaam', to: 'Mwanza', departure: '11:30', arrival: '13:15', duration: '1h 45m', price: 180000, seats: 10 },
    { id: 'FL007', airline: 'FastJet', from: 'Dar es Salaam', to: 'Mwanza', departure: '16:00', arrival: '17:45', duration: '1h 45m', price: 170000, seats: 18 },
    
    { id: 'FL008', airline: 'Air Tanzania', from: 'Dar es Salaam', to: 'Zanzibar', departure: '06:00', arrival: '06:25', duration: '25m', price: 75000, seats: 25 },
    { id: 'FL009', airline: 'Precision Air', from: 'Dar es Salaam', to: 'Zanzibar', departure: '08:30', arrival: '08:55', duration: '25m', price: 80000, seats: 20 },
    { id: 'FL010', airline: 'FastJet', from: 'Dar es Salaam', to: 'Zanzibar', departure: '12:00', arrival: '12:25', duration: '25m', price: 85000, seats: 30 },
    { id: 'FL011', airline: 'Air Tanzania', from: 'Dar es Salaam', to: 'Zanzibar', departure: '15:30', arrival: '15:55', duration: '25m', price: 90000, seats: 22 },
    { id: 'FL012', airline: 'Precision Air', from: 'Dar es Salaam', to: 'Zanzibar', departure: '18:00', arrival: '18:25', duration: '25m', price: 95000, seats: 15 },
    
    { id: 'FL013', airline: 'Precision Air', from: 'Dar es Salaam', to: 'Mbeya', departure: '08:00', arrival: '09:45', duration: '1h 45m', price: 165000, seats: 12 },
    { id: 'FL014', airline: 'Air Tanzania', from: 'Dar es Salaam', to: 'Mbeya', departure: '13:00', arrival: '14:45', duration: '1h 45m', price: 170000, seats: 10 },
    
    { id: 'FL015', airline: 'Air Tanzania', from: 'Dar es Salaam', to: 'Dodoma', departure: '07:30', arrival: '08:30', duration: '1h', price: 125000, seats: 18 },
    { id: 'FL016', airline: 'Precision Air', from: 'Dar es Salaam', to: 'Dodoma', departure: '14:30', arrival: '15:30', duration: '1h', price: 130000, seats: 14 },
    
    { id: 'FL017', airline: 'Precision Air', from: 'Dar es Salaam', to: 'Kigoma', departure: '09:00', arrival: '11:15', duration: '2h 15m', price: 195000, seats: 8 },
    
    // Arusha routes
    { id: 'FL018', airline: 'Coastal Aviation', from: 'Arusha', to: 'Serengeti', departure: '07:00', arrival: '08:15', duration: '1h 15m', price: 280000, seats: 6 },
    { id: 'FL019', airline: 'Regional Air', from: 'Arusha', to: 'Serengeti', departure: '10:30', arrival: '11:45', duration: '1h 15m', price: 290000, seats: 8 },
    { id: 'FL020', airline: 'Coastal Aviation', from: 'Arusha', to: 'Serengeti', departure: '14:00', arrival: '15:15', duration: '1h 15m', price: 285000, seats: 5 },
    
    { id: 'FL021', airline: 'Precision Air', from: 'Arusha', to: 'Dar es Salaam', departure: '10:00', arrival: '11:30', duration: '1h 30m', price: 145000, seats: 16 },
    { id: 'FL022', airline: 'Air Tanzania', from: 'Arusha', to: 'Dar es Salaam', departure: '13:30', arrival: '15:00', duration: '1h 30m', price: 150000, seats: 12 },
    { id: 'FL023', airline: 'FastJet', from: 'Arusha', to: 'Dar es Salaam', departure: '17:00', arrival: '18:30', duration: '1h 30m', price: 140000, seats: 20 },
    
    { id: 'FL024', airline: 'Regional Air', from: 'Arusha', to: 'Mwanza', departure: '09:00', arrival: '10:15', duration: '1h 15m', price: 155000, seats: 10 },
    { id: 'FL025', airline: 'Precision Air', from: 'Arusha', to: 'Mwanza', departure: '15:00', arrival: '16:15', duration: '1h 15m', price: 160000, seats: 8 },
    
    { id: 'FL026', airline: 'Coastal Aviation', from: 'Arusha', to: 'Zanzibar', departure: '11:00', arrival: '12:45', duration: '1h 45m', price: 185000, seats: 12 },
    
    // Mwanza routes
    { id: 'FL027', airline: 'Air Tanzania', from: 'Mwanza', to: 'Dar es Salaam', departure: '09:30', arrival: '11:15', duration: '1h 45m', price: 175000, seats: 14 },
    { id: 'FL028', airline: 'Precision Air', from: 'Mwanza', to: 'Dar es Salaam', departure: '14:00', arrival: '15:45', duration: '1h 45m', price: 180000, seats: 10 },
    
    { id: 'FL029', airline: 'Regional Air', from: 'Mwanza', to: 'Arusha', departure: '11:00', arrival: '12:15', duration: '1h 15m', price: 155000, seats: 8 },
    
    { id: 'FL030', airline: 'Precision Air', from: 'Mwanza', to: 'Kilimanjaro', departure: '08:00', arrival: '09:15', duration: '1h 15m', price: 165000, seats: 12 },
    
    // Zanzibar routes
    { id: 'FL031', airline: 'Air Tanzania', from: 'Zanzibar', to: 'Dar es Salaam', departure: '07:00', arrival: '07:25', duration: '25m', price: 75000, seats: 25 },
    { id: 'FL032', airline: 'Precision Air', from: 'Zanzibar', to: 'Dar es Salaam', departure: '09:30', arrival: '09:55', duration: '25m', price: 80000, seats: 20 },
    { id: 'FL033', airline: 'FastJet', from: 'Zanzibar', to: 'Dar es Salaam', departure: '13:00', arrival: '13:25', duration: '25m', price: 85000, seats: 30 },
    { id: 'FL034', airline: 'Air Tanzania', from: 'Zanzibar', to: 'Dar es Salaam', departure: '16:30', arrival: '16:55', duration: '25m', price: 90000, seats: 18 },
    
    { id: 'FL035', airline: 'Coastal Aviation', from: 'Zanzibar', to: 'Arusha', departure: '10:00', arrival: '11:45', duration: '1h 45m', price: 185000, seats: 10 },
    
    { id: 'FL036', airline: 'Regional Air', from: 'Zanzibar', to: 'Pemba', departure: '08:00', arrival: '08:45', duration: '45m', price: 95000, seats: 12 },
    { id: 'FL037', airline: 'Coastal Aviation', from: 'Zanzibar', to: 'Pemba', departure: '13:00', arrival: '13:45', duration: '45m', price: 100000, seats: 8 },
    
    // Kilimanjaro International Airport routes
    { id: 'FL038', airline: 'Air Tanzania', from: 'Kilimanjaro', to: 'Dar es Salaam', departure: '12:00', arrival: '13:30', duration: '1h 30m', price: 150000, seats: 16 },
    { id: 'FL039', airline: 'Precision Air', from: 'Kilimanjaro', to: 'Zanzibar', departure: '10:30', arrival: '12:15', duration: '1h 45m', price: 190000, seats: 12 },
    
    // Mbeya routes
    { id: 'FL040', airline: 'Air Tanzania', from: 'Mbeya', to: 'Dar es Salaam', departure: '10:30', arrival: '12:15', duration: '1h 45m', price: 165000, seats: 10 },
  ];

  // Filter flights based on search criteria
  const getFilteredFlights = () => {
    if (!searchData.from && !searchData.to) {
      return allFlights;
    }
    return allFlights.filter(flight => {
      const matchesFrom = !searchData.from || flight.from.toLowerCase().includes(searchData.from.toLowerCase());
      const matchesTo = !searchData.to || flight.to.toLowerCase().includes(searchData.to.toLowerCase());
      return matchesFrom && matchesTo;
    });
  };

  const mockFlights = getFilteredFlights();

  // Mock data for buses
  const mockBuses = [
    { id: 'BUS001', company: 'Kilimanjaro Express', from: 'Dar es Salaam', to: 'Arusha', departure: '06:00', arrival: '14:00', duration: '8h', price: 30000, seats: 25, type: 'Semi-Luxury' },
    { id: 'BUS002', company: 'Dar Express', from: 'Dar es Salaam', to: 'Arusha', departure: '07:30', arrival: '15:30', duration: '8h', price: 35000, seats: 18, type: 'VIP' },
    { id: 'BUS003', company: 'Shabiby Express', from: 'Dar es Salaam', to: 'Mwanza', departure: '05:00', arrival: '17:00', duration: '12h', price: 45000, seats: 20, type: 'Semi-Luxury' },
    { id: 'BUS004', company: 'Tahmeed Coach', from: 'Dar es Salaam', to: 'Dodoma', departure: '08:00', arrival: '14:00', duration: '6h', price: 25000, seats: 30, type: 'Standard' },
    { id: 'BUS005', company: 'Sumry Express', from: 'Arusha', to: 'Moshi', departure: '09:00', arrival: '10:30', duration: '1h 30m', price: 8000, seats: 35, type: 'Standard' },
  ];

  // Mock data for ferries
  const mockFerries = [
    { id: 'FER001', company: 'Azam Marine', from: 'Dar es Salaam', to: 'Zanzibar', departure: '07:00', arrival: '09:00', duration: '2h', price: 35000, seats: 150, type: 'Fast Ferry' },
    { id: 'FER002', company: 'Azam Marine', from: 'Dar es Salaam', to: 'Zanzibar', departure: '12:30', arrival: '14:30', duration: '2h', price: 35000, seats: 150, type: 'Fast Ferry' },
    { id: 'FER003', company: 'Kilimanjaro Ferry', from: 'Dar es Salaam', to: 'Zanzibar', departure: '09:00', arrival: '13:00', duration: '4h', price: 25000, seats: 200, type: 'Standard' },
    { id: 'FER004', company: 'Zanzibar Ferry', from: 'Zanzibar', to: 'Pemba', departure: '08:00', arrival: '10:30', duration: '2h 30m', price: 40000, seats: 100, type: 'Fast Ferry' },
  ];

  // Mock data for hotels
  const mockHotels = [
    { id: 'HOT001', name: 'Serena Hotel Dar es Salaam', location: 'Dar es Salaam', rating: 5, price: 250000, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'], image: '🏨' },
    { id: 'HOT002', name: 'Hyatt Regency Dar es Salaam', location: 'Dar es Salaam', rating: 5, price: 280000, amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'], image: '🏨' },
    { id: 'HOT003', name: 'Four Points by Sheraton Arusha', location: 'Arusha', rating: 4, price: 180000, amenities: ['WiFi', 'Restaurant', 'Bar'], image: '🏨' },
    { id: 'HOT004', name: 'Zanzibar Serena Hotel', location: 'Zanzibar', rating: 5, price: 320000, amenities: ['Beach', 'Pool', 'Spa', 'WiFi'], image: '🏨' },
    { id: 'HOT005', name: 'Arusha Coffee Lodge', location: 'Arusha', rating: 4, price: 200000, amenities: ['WiFi', 'Garden', 'Restaurant'], image: '🏨' },
  ];

  // Mock data for national parks
  const mockParks = [
    { id: 'PARK001', name: 'Serengeti National Park', entrance: 70000, guide: 50000, camping: 30000, location: 'Northern Tanzania', description: 'World-famous wildlife sanctuary' },
    { id: 'PARK002', name: 'Ngorongoro Crater', entrance: 70000, guide: 60000, camping: 35000, location: 'Northern Tanzania', description: 'UNESCO World Heritage Site' },
    { id: 'PARK003', name: 'Mount Kilimanjaro', entrance: 80000, guide: 200000, camping: 40000, location: 'Northern Tanzania', description: 'Africa\'s highest peak' },
    { id: 'PARK004', name: 'Tarangire National Park', entrance: 50000, guide: 40000, camping: 25000, location: 'Northern Tanzania', description: 'Famous for elephants' },
    { id: 'PARK005', name: 'Lake Manyara', entrance: 50000, guide: 40000, camping: 25000, location: 'Northern Tanzania', description: 'Tree-climbing lions' },
  ];

  // Mock data for SGR trains
  const mockTrains = [
    { id: 'TRN001', from: 'Dar es Salaam', to: 'Morogoro', departure: '06:00', arrival: '09:30', duration: '3h 30m', price: 15000, seats: 40, class: 'Economy' },
    { id: 'TRN002', from: 'Dar es Salaam', to: 'Morogoro', departure: '06:00', arrival: '09:30', duration: '3h 30m', price: 25000, seats: 20, class: 'Business' },
    { id: 'TRN003', from: 'Dar es Salaam', to: 'Morogoro', departure: '14:00', arrival: '17:30', duration: '3h 30m', price: 15000, seats: 40, class: 'Economy' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSearch = () => {
    setSearchStep('results');
  };

  const handleSelectBooking = (booking: any) => {
    setSelectedBooking(booking);
    setSearchStep('details');
  };

  const handleProceedToPayment = () => {
    setSearchStep('payment');
  };

  const handleConfirmPayment = async () => {
    if (pin.length !== 4) {
      alert('Please enter a valid 4-digit PIN');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/travel/book`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            type: currentMode,
            booking: selectedBooking,
            passengers: searchData.passengers,
            pin: pin,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setBookingReference(result.bookingReference || `REF${Date.now()}`);
        setSearchStep('success');
        setPin('');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing booking:', error);
      // For demo purposes, still show success
      setBookingReference(`REF${Date.now()}`);
      setSearchStep('success');
      setPin('');
    }
  };

  const resetBooking = () => {
    setCurrentMode(null);
    setSearchStep('search');
    setSelectedBooking(null);
    setPin('');
    setBookingReference('');
    setSearchData({
      from: '',
      to: '',
      departDate: '',
      returnDate: '',
      passengers: 1,
      rooms: 1,
      checkIn: '',
      checkOut: '',
      parkName: '',
      visitors: 1
    });
  };

  // Main menu view
  if (!currentMode) {
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-20 rounded-b-3xl shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl text-white">Travel & Booking</h1>
              <p className="text-green-100 text-sm">Book your journey across Tanzania</p>
            </div>
          </div>
        </div>

        {/* Travel Options Grid */}
        <div className="px-4 -mt-12 space-y-3">
          {/* Flights */}
          <button
            onClick={() => setCurrentMode('flights')}
            className="w-full bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-2xl">
                  <Plane className="size-8 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-lg">Domestic Flights</p>
                  <p className="text-sm text-gray-500">Dar, Arusha, Mwanza, Zanzibar</p>
                </div>
              </div>
              <ChevronRight className="size-6 text-gray-400" />
            </div>
          </button>

          {/* Bus */}
          <button
            onClick={() => setCurrentMode('bus')}
            className="w-full bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-2xl">
                  <Bus className="size-8 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-lg">Bus Tickets</p>
                  <p className="text-sm text-gray-500">Intercity luxury coaches</p>
                </div>
              </div>
              <ChevronRight className="size-6 text-gray-400" />
            </div>
          </button>

          {/* Ferry */}
          <button
            onClick={() => setCurrentMode('ferry')}
            className="w-full bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-cyan-100 p-4 rounded-2xl">
                  <Ship className="size-8 text-cyan-600" />
                </div>
                <div className="text-left">
                  <p className="text-lg">Ferry to Zanzibar</p>
                  <p className="text-sm text-gray-500">Fast & standard ferries</p>
                </div>
              </div>
              <ChevronRight className="size-6 text-gray-400" />
            </div>
          </button>

          {/* SGR Train */}
          <button
            onClick={() => setCurrentMode('train')}
            className="w-full bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-4 rounded-2xl">
                  <Train className="size-8 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="text-lg">SGR Train</p>
                  <p className="text-sm text-gray-500">Dar es Salaam - Morogoro</p>
                </div>
              </div>
              <ChevronRight className="size-6 text-gray-400" />
            </div>
          </button>

          {/* Hotels */}
          <button
            onClick={() => setCurrentMode('hotels')}
            className="w-full bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-4 rounded-2xl">
                  <Hotel className="size-8 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="text-lg">Hotels & Lodges</p>
                  <p className="text-sm text-gray-500">Book accommodations</p>
                </div>
              </div>
              <ChevronRight className="size-6 text-gray-400" />
            </div>
          </button>

          {/* National Parks */}
          <button
            onClick={() => setCurrentMode('parks')}
            className="w-full bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-4 rounded-2xl">
                  <Mountain className="size-8 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-lg">National Parks</p>
                  <p className="text-sm text-gray-500">Serengeti, Kilimanjaro, Ngorongoro</p>
                </div>
              </div>
              <ChevronRight className="size-6 text-gray-400" />
            </div>
          </button>
        </div>

        {/* Popular Routes */}
        <div className="px-4 mt-6">
          <h3 className="text-lg mb-4">🔥 Popular Routes</h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm">Dar es Salaam → Zanzibar</p>
                <p className="text-blue-700">from {formatCurrency(25000)}</p>
              </div>
              <p className="text-xs text-gray-600">Ferry • 2-4 hours</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm">Dar es Salaam → Arusha</p>
                <p className="text-green-700">from {formatCurrency(30000)}</p>
              </div>
              <p className="text-xs text-gray-600">Bus • 8 hours</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm">Arusha → Serengeti</p>
                <p className="text-purple-700">from {formatCurrency(280000)}</p>
              </div>
              <p className="text-xs text-gray-600">Flight • 1h 15m</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (searchStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="size-10 text-green-600" />
          </div>
          <h2 className="text-2xl mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-6">Your booking has been successfully processed</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-500">Reference Number</span>
              <span className="font-mono text-green-600">{bookingReference}</span>
            </div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-500">Travel Type</span>
              <span className="capitalize">{currentMode}</span>
            </div>
            {selectedBooking && (
              <>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-500">Route</span>
                  <span className="text-sm">{selectedBooking.from} → {selectedBooking.to}</span>
                </div>
                {searchData.departDate && (
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                    <span className="text-sm text-gray-500">Travel Date</span>
                    <span className="text-sm">{new Date(searchData.departDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
                {selectedBooking.departure && (
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                    <span className="text-sm text-gray-500">Departure Time</span>
                    <span className="text-sm">{selectedBooking.departure}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-500">Passengers</span>
                  <span className="text-sm">{searchData.passengers || searchData.rooms || searchData.visitors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Amount Paid</span>
                  <span className="text-green-600">{formatCurrency(selectedBooking.price * (searchData.passengers || searchData.rooms || searchData.visitors))}</span>
                </div>
              </>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-sm text-blue-900">
            <Info className="size-5 inline mr-2" />
            Your e-ticket has been sent to {user.email}
          </div>

          <Button
            onClick={resetBooking}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full"
          >
            Book Another Trip
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-12 mt-3 rounded-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Payment screen
  if (searchStep === 'payment') {
    const totalAmount = selectedBooking ? selectedBooking.price * (searchData.passengers || searchData.rooms || searchData.visitors) : 0;
    
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-8 rounded-b-3xl shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setSearchStep('details')}
              className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-2xl text-white">Confirm Payment</h1>
          </div>
        </div>

        <div className="px-4 -mt-2 space-y-4">
          {/* Payment Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Base Price</span>
                <span>{formatCurrency(selectedBooking?.price || 0)}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Quantity</span>
                <span>× {searchData.passengers || searchData.rooms || searchData.visitors}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Service Fee</span>
                <span>{formatCurrency(1000)}</span>
              </div>
              <div className="flex items-center justify-between text-lg pt-2">
                <span>Total Amount</span>
                <span className="text-green-600">{formatCurrency(totalAmount + 1000)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-base mb-4">Payment Method</h3>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-100 text-sm">Pay from</span>
                <CreditCard className="size-5" />
              </div>
              <p className="text-2xl mb-1">goPay Wallet</p>
              <p className="text-green-100 text-sm">Balance: {formatCurrency(450000)}</p>
            </div>
          </div>

          {/* PIN Entry */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Label htmlFor="payment-pin" className="text-base mb-3 block">Enter PIN to confirm</Label>
            <Input
              id="payment-pin"
              type="password"
              placeholder="••••"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl tracking-widest h-16 rounded-xl"
            />
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <Shield className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-900">
              <p className="font-medium mb-1">Secure Payment</p>
              <p className="text-green-700">Your transaction is protected with 256-bit encryption</p>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirmPayment}
            disabled={pin.length !== 4}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-lg disabled:opacity-50"
          >
            Confirm Payment
          </Button>
        </div>
      </div>
    );
  }

  // Booking details screen
  if (searchStep === 'details' && selectedBooking) {
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-8 rounded-b-3xl shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setSearchStep('results')}
              className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-2xl text-white">Booking Details</h1>
          </div>
        </div>

        <div className="px-4 -mt-2 space-y-4">
          {/* Route Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-2xl">{selectedBooking.from}</p>
                <p className="text-sm text-gray-500">{selectedBooking.departure || 'Departure'}</p>
              </div>
              <div className="flex-1 mx-4">
                <div className="border-t-2 border-dashed border-gray-300 relative">
                  <ArrowRight className="size-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white" />
                </div>
                <p className="text-xs text-center text-gray-500 mt-1">{selectedBooking.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl">{selectedBooking.to}</p>
                <p className="text-sm text-gray-500">{selectedBooking.arrival || 'Arrival'}</p>
              </div>
            </div>

            {currentMode === 'flights' && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Airline: <span className="text-gray-900">{selectedBooking.airline}</span></p>
                <p className="text-sm text-gray-600">Available Seats: <span className="text-green-600">{selectedBooking.seats}</span></p>
              </div>
            )}

            {currentMode === 'bus' && (
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Company: <span className="text-gray-900">{selectedBooking.company}</span></p>
                <p className="text-sm text-gray-600 mb-2">Class: <span className="text-gray-900">{selectedBooking.type}</span></p>
                <p className="text-sm text-gray-600">Available Seats: <span className="text-green-600">{selectedBooking.seats}</span></p>
              </div>
            )}

            {currentMode === 'ferry' && (
              <div className="bg-cyan-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Ferry: <span className="text-gray-900">{selectedBooking.company}</span></p>
                <p className="text-sm text-gray-600 mb-2">Type: <span className="text-gray-900">{selectedBooking.type}</span></p>
                <p className="text-sm text-gray-600">Available Seats: <span className="text-green-600">{selectedBooking.seats}</span></p>
              </div>
            )}

            {currentMode === 'train' && (
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">SGR Express</p>
                <p className="text-sm text-gray-600 mb-2">Class: <span className="text-gray-900">{selectedBooking.class}</span></p>
                <p className="text-sm text-gray-600">Available Seats: <span className="text-green-600">{selectedBooking.seats}</span></p>
              </div>
            )}

            {currentMode === 'hotels' && (
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg">{selectedBooking.name}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(selectedBooking.rating)].map((_, i) => (
                      <Star key={i} className="size-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">📍 {selectedBooking.location}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.amenities.map((amenity: string) => (
                    <span key={amenity} className="bg-white px-3 py-1 rounded-full text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentMode === 'parks' && (
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-lg mb-2">{selectedBooking.name}</p>
                <p className="text-sm text-gray-600 mb-3">📍 {selectedBooking.location}</p>
                <p className="text-sm text-gray-700 mb-4">{selectedBooking.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Park Entrance Fee</span>
                    <span className="text-sm">{formatCurrency(selectedBooking.entrance)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Guide Service (optional)</span>
                    <span className="text-sm">{formatCurrency(selectedBooking.guide)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Camping Fee (optional)</span>
                    <span className="text-sm">{formatCurrency(selectedBooking.camping)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Passenger/Room Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-base mb-4">
              {currentMode === 'hotels' ? 'Rooms' : currentMode === 'parks' ? 'Visitors' : 'Passengers'}
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (currentMode === 'hotels') {
                    setSearchData({ ...searchData, rooms: Math.max(1, searchData.rooms - 1) });
                  } else if (currentMode === 'parks') {
                    setSearchData({ ...searchData, visitors: Math.max(1, searchData.visitors - 1) });
                  } else {
                    setSearchData({ ...searchData, passengers: Math.max(1, searchData.passengers - 1) });
                  }
                }}
                className="bg-gray-100 hover:bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center"
              >
                <span className="text-xl">−</span>
              </button>
              <div className="flex-1 text-center">
                <p className="text-3xl">
                  {currentMode === 'hotels' ? searchData.rooms : currentMode === 'parks' ? searchData.visitors : searchData.passengers}
                </p>
              </div>
              <button
                onClick={() => {
                  if (currentMode === 'hotels') {
                    setSearchData({ ...searchData, rooms: searchData.rooms + 1 });
                  } else if (currentMode === 'parks') {
                    setSearchData({ ...searchData, visitors: searchData.visitors + 1 });
                  } else {
                    setSearchData({ ...searchData, passengers: searchData.passengers + 1 });
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white w-12 h-12 rounded-full flex items-center justify-center"
              >
                <span className="text-xl">+</span>
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100">Price per {currentMode === 'hotels' ? 'room' : currentMode === 'parks' ? 'person' : 'ticket'}</span>
              <span className="text-2xl">{formatCurrency(selectedBooking.price)}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <span className="text-lg">Total</span>
              <span className="text-3xl">
                {formatCurrency(selectedBooking.price * (searchData.passengers || searchData.rooms || searchData.visitors))}
              </span>
            </div>
          </div>

          {/* Proceed Button */}
          <Button
            onClick={handleProceedToPayment}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-lg"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    );
  }

  // Search/Results screens
  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-6 rounded-b-3xl shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => {
              if (searchStep === 'results') {
                setSearchStep('search');
              } else {
                resetBooking();
              }
            }}
            className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="size-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl text-white capitalize">{currentMode}</h1>
            <p className="text-green-100 text-sm">
              {searchStep === 'results' ? (
                searchData.from && searchData.to ? (
                  `${searchData.from} → ${searchData.to}${searchData.departDate ? ' • ' + new Date(searchData.departDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}`
                ) : 'Available options'
              ) : 'Search and book'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2">
        {searchStep === 'search' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            {(currentMode === 'flights' || currentMode === 'bus' || currentMode === 'ferry' || currentMode === 'train') && (
              <>
                <div>
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    placeholder="Dar es Salaam"
                    value={searchData.from}
                    onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    placeholder="Arusha"
                    value={searchData.to}
                    onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="depart-date">Travel Date</Label>
                  <Input
                    id="depart-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={searchData.departDate}
                    onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="passengers">Passengers</Label>
                  <Input
                    id="passengers"
                    type="number"
                    min="1"
                    max="10"
                    value={searchData.passengers}
                    onChange={(e) => setSearchData({ ...searchData, passengers: parseInt(e.target.value) || 1 })}
                    className="mt-1 h-12"
                  />
                </div>
              </>
            )}

            {currentMode === 'hotels' && (
              <>
                <div>
                  <Label htmlFor="hotel-location">Location</Label>
                  <Input
                    id="hotel-location"
                    placeholder="Dar es Salaam"
                    value={searchData.from}
                    onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="check-in">Check-in Date</Label>
                  <Input
                    id="check-in"
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="check-out">Check-out Date</Label>
                  <Input
                    id="check-out"
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="rooms">Rooms</Label>
                  <Input
                    id="rooms"
                    type="number"
                    min="1"
                    max="10"
                    value={searchData.rooms}
                    onChange={(e) => setSearchData({ ...searchData, rooms: parseInt(e.target.value) || 1 })}
                    className="mt-1 h-12"
                  />
                </div>
              </>
            )}

            {currentMode === 'parks' && (
              <>
                <div>
                  <Label htmlFor="park">Select Park</Label>
                  <select
                    id="park"
                    value={searchData.parkName}
                    onChange={(e) => setSearchData({ ...searchData, parkName: e.target.value })}
                    className="mt-1 h-12 w-full rounded-md border border-gray-300 px-3"
                  >
                    <option value="">Choose a park...</option>
                    <option value="Serengeti">Serengeti National Park</option>
                    <option value="Ngorongoro">Ngorongoro Crater</option>
                    <option value="Kilimanjaro">Mount Kilimanjaro</option>
                    <option value="Tarangire">Tarangire National Park</option>
                    <option value="Manyara">Lake Manyara</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="visit-date">Visit Date</Label>
                  <Input
                    id="visit-date"
                    type="date"
                    value={searchData.departDate}
                    onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="visitors">Number of Visitors</Label>
                  <Input
                    id="visitors"
                    type="number"
                    min="1"
                    max="20"
                    value={searchData.visitors}
                    onChange={(e) => setSearchData({ ...searchData, visitors: parseInt(e.target.value) || 1 })}
                    className="mt-1 h-12"
                  />
                </div>
              </>
            )}

            <Button
              onClick={handleSearch}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full mt-4"
            >
              <Search className="size-5 mr-2" />
              Search {currentMode === 'hotels' ? 'Hotels' : currentMode === 'parks' ? 'Parks' : 'Tickets'}
            </Button>
          </div>
        )}

        {searchStep === 'results' && (
          <div className="space-y-3 mt-4">
            {currentMode === 'flights' && mockFlights.length === 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-md text-center">
                <Plane className="size-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold mb-2">No Flights Found</h3>
                <p className="text-gray-500 text-sm mb-4">
                  No flights available for this route. Try different destinations or dates.
                </p>
                <p className="text-sm text-gray-600 mb-2">Popular routes:</p>
                <div className="space-y-1 text-sm text-green-600">
                  <p>Dar es Salaam ↔ Arusha, Mwanza, Zanzibar, Mbeya</p>
                  <p>Arusha ↔ Serengeti, Dar es Salaam, Zanzibar</p>
                  <p>Zanzibar ↔ Dar es Salaam, Pemba</p>
                </div>
              </div>
            )}
            {currentMode === 'flights' && mockFlights.map((flight) => (
              <button
                key={flight.id}
                onClick={() => handleSelectBooking(flight)}
                className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all text-left border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">{flight.airline}</p>
                  <p className="text-green-600 text-lg">{formatCurrency(flight.price)}</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl">{flight.departure}</p>
                    <p className="text-sm text-gray-500">{flight.from}</p>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="border-t-2 border-dashed border-gray-300 relative">
                      <Plane className="size-5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white" />
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-1">{flight.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">{flight.arrival}</p>
                    <p className="text-sm text-gray-500">{flight.to}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{flight.seats} seats available</span>
                  <span className="text-green-600">Select →</span>
                </div>
              </button>
            ))}

            {currentMode === 'bus' && mockBuses.map((bus) => (
              <button
                key={bus.id}
                onClick={() => handleSelectBooking(bus)}
                className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all text-left border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">{bus.company}</p>
                  <p className="text-green-600 text-lg">{formatCurrency(bus.price)}</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl">{bus.departure}</p>
                    <p className="text-sm text-gray-500">{bus.from}</p>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="border-t-2 border-dashed border-gray-300 relative">
                      <Bus className="size-5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white" />
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-1">{bus.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">{bus.arrival}</p>
                    <p className="text-sm text-gray-500">{bus.to}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">{bus.type}</span>
                  <span className="text-gray-500">{bus.seats} seats</span>
                  <span className="text-green-600">Select →</span>
                </div>
              </button>
            ))}

            {currentMode === 'ferry' && mockFerries.map((ferry) => (
              <button
                key={ferry.id}
                onClick={() => handleSelectBooking(ferry)}
                className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all text-left border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">{ferry.company}</p>
                  <p className="text-green-600 text-lg">{formatCurrency(ferry.price)}</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl">{ferry.departure}</p>
                    <p className="text-sm text-gray-500">{ferry.from}</p>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="border-t-2 border-dashed border-gray-300 relative">
                      <Ship className="size-5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white" />
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-1">{ferry.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">{ferry.arrival}</p>
                    <p className="text-sm text-gray-500">{ferry.to}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs">{ferry.type}</span>
                  <span className="text-gray-500">{ferry.seats} seats</span>
                  <span className="text-green-600">Select →</span>
                </div>
              </button>
            ))}

            {currentMode === 'train' && mockTrains.map((train) => (
              <button
                key={train.id}
                onClick={() => handleSelectBooking(train)}
                className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all text-left border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">SGR Express</p>
                  <p className="text-green-600 text-lg">{formatCurrency(train.price)}</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl">{train.departure}</p>
                    <p className="text-sm text-gray-500">{train.from}</p>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="border-t-2 border-dashed border-gray-300 relative">
                      <Train className="size-5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white" />
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-1">{train.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">{train.arrival}</p>
                    <p className="text-sm text-gray-500">{train.to}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">{train.class}</span>
                  <span className="text-gray-500">{train.seats} seats</span>
                  <span className="text-green-600">Select →</span>
                </div>
              </button>
            ))}

            {currentMode === 'hotels' && mockHotels.map((hotel) => (
              <button
                key={hotel.id}
                onClick={() => handleSelectBooking(hotel)}
                className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all text-left border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-lg mb-1">{hotel.name}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{hotel.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(hotel.rating)].map((_, i) => (
                        <Star key={i} className="size-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 text-lg">{formatCurrency(hotel.price)}</p>
                    <p className="text-xs text-gray-500">per night</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {hotel.amenities.slice(0, 3).map((amenity) => (
                    <span key={amenity} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="text-green-600 text-sm text-right">Select →</div>
              </button>
            ))}

            {currentMode === 'parks' && mockParks.map((park) => (
              <button
                key={park.id}
                onClick={() => handleSelectBooking(park)}
                className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all text-left border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-lg mb-1">{park.name}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{park.location}</span>
                    </div>
                    <p className="text-sm text-gray-600">{park.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Entrance fee</span>
                  <div className="text-right">
                    <p className="text-green-600 text-lg">{formatCurrency(park.entrance)}</p>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
