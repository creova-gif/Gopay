import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { 
  ArrowLeft, Bus, Ship, Plane, Hotel, Mountain, Calendar, Users, MapPin, 
  Clock, ChevronRight, Star, Check, CreditCard, Train, Ticket, Search,
  ArrowRight, Info, Shield, AlertCircle, Sparkles, TrendingUp, Zap, Heart,
  Wifi, Coffee, UtensilsCrossed, Waves, TreePalm
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { UnifiedBookingSystem } from './UnifiedBookingSystem';

interface TravelPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type TravelMode = 'flights' | 'bus' | 'ferry' | 'hotels' | 'parks' | 'train' | null;
type BookingService = 'flights' | 'buses' | 'sgr' | 'hotels' | 'parks';

export function TravelPage({ user, accessToken, onBack }: TravelPageProps) {
  const [currentMode, setCurrentMode] = useState<TravelMode>(null);
  const [searchStep, setSearchStep] = useState<'search' | 'results' | 'details' | 'payment' | 'success'>('search');
  const [showUnifiedBooking, setShowUnifiedBooking] = useState(false);
  const [selectedBookingService, setSelectedBookingService] = useState<BookingService | null>(null);
  
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

  // Popular Cities for autocomplete
  const tanzaniaCities = [
    'Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Zanzibar', 'Mbeya', 
    'Morogoro', 'Tanga', 'Kigoma', 'Kilimanjaro', 'Moshi', 'Pemba', 'Serengeti'
  ];

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
    { id: 'BUS001', company: 'Kilimanjaro Express', from: 'Dar es Salaam', to: 'Arusha', departure: '06:00', arrival: '14:00', duration: '8h', price: 30000, seats: 25, type: 'Semi-Luxury', rating: 4.5 },
    { id: 'BUS002', company: 'Dar Express', from: 'Dar es Salaam', to: 'Arusha', departure: '07:30', arrival: '15:30', duration: '8h', price: 35000, seats: 18, type: 'VIP', rating: 4.8 },
    { id: 'BUS003', company: 'Shabiby Express', from: 'Dar es Salaam', to: 'Mwanza', departure: '05:00', arrival: '17:00', duration: '12h', price: 45000, seats: 20, type: 'Semi-Luxury', rating: 4.3 },
    { id: 'BUS004', company: 'Tahmeed Coach', from: 'Dar es Salaam', to: 'Dodoma', departure: '08:00', arrival: '14:00', duration: '6h', price: 25000, seats: 30, type: 'Standard', rating: 4.0 },
    { id: 'BUS005', company: 'Sumry Express', from: 'Arusha', to: 'Moshi', departure: '09:00', arrival: '10:30', duration: '1h 30m', price: 8000, seats: 35, type: 'Standard', rating: 4.2 },
  ];

  // Mock data for ferries
  const mockFerries = [
    { id: 'FER001', company: 'Azam Marine', from: 'Dar es Salaam', to: 'Zanzibar', departure: '07:00', arrival: '09:00', duration: '2h', price: 35000, seats: 150, type: 'Fast Ferry', rating: 4.7 },
    { id: 'FER002', company: 'Azam Marine', from: 'Dar es Salaam', to: 'Zanzibar', departure: '12:30', arrival: '14:30', duration: '2h', price: 35000, seats: 150, type: 'Fast Ferry', rating: 4.7 },
    { id: 'FER003', company: 'Kilimanjaro Ferry', from: 'Dar es Salaam', to: 'Zanzibar', departure: '09:00', arrival: '13:00', duration: '4h', price: 25000, seats: 200, type: 'Standard', rating: 4.2 },
    { id: 'FER004', company: 'Zanzibar Ferry', from: 'Zanzibar', to: 'Pemba', departure: '08:00', arrival: '10:30', duration: '2h 30m', price: 40000, seats: 100, type: 'Fast Ferry', rating: 4.5 },
  ];

  // Mock data for hotels
  const mockHotels = [
    { id: 'HOT001', name: 'Serena Hotel Dar es Salaam', location: 'Dar es Salaam', rating: 5, price: 250000, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'], image: 'https://images.unsplash.com/photo-1729717949780-46e511489c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3Njc4Mjk0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'HOT002', name: 'Hyatt Regency Dar es Salaam', location: 'Dar es Salaam', rating: 5, price: 280000, amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'], image: 'https://images.unsplash.com/photo-1729717949780-46e511489c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3Njc4Mjk0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'HOT003', name: 'Four Points by Sheraton Arusha', location: 'Arusha', rating: 4, price: 180000, amenities: ['WiFi', 'Restaurant', 'Bar'], image: 'https://images.unsplash.com/photo-1729717949780-46e511489c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3Njc4Mjk0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'HOT004', name: 'Zanzibar Serena Hotel', location: 'Zanzibar', rating: 5, price: 320000, amenities: ['Beach', 'Pool', 'Spa', 'WiFi'], image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxaYW56aWJhciUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NzkwMTQ4OHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'HOT005', name: 'Arusha Coffee Lodge', location: 'Arusha', rating: 4, price: 200000, amenities: ['WiFi', 'Garden', 'Restaurant'], image: 'https://images.unsplash.com/photo-1729717949780-46e511489c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3Njc4Mjk0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  ];

  // Mock data for national parks
  const mockParks = [
    { id: 'PARK001', name: 'Serengeti National Park', entrance: 70000, guide: 50000, camping: 30000, location: 'Northern Tanzania', description: 'World-famous wildlife sanctuary', image: 'https://images.unsplash.com/photo-1641133292545-32e441e60190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZXJlbmdldGklMjBzYWZhcmklMjB3aWxkbGlmZXxlbnwxfHx8fDE3Njc4NzU1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'PARK002', name: 'Ngorongoro Crater', entrance: 70000, guide: 60000, camping: 35000, location: 'Northern Tanzania', description: 'UNESCO World Heritage Site', image: 'https://images.unsplash.com/photo-1641133292545-32e441e60190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZXJlbmdldGklMjBzYWZhcmklMjB3aWxkbGlmZXxlbnwxfHx8fDE3Njc4NzU1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'PARK003', name: 'Mount Kilimanjaro', entrance: 80000, guide: 200000, camping: 40000, location: 'Northern Tanzania', description: 'Africa\'s highest peak', image: 'https://images.unsplash.com/photo-1518729571365-9a891a9df2bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3VudCUyMEtpbGltYW5qYXJvfGVufDF8fHx8MTc2NzkwMTQ4OXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'PARK004', name: 'Tarangire National Park', entrance: 50000, guide: 40000, camping: 25000, location: 'Northern Tanzania', description: 'Famous for elephants', image: 'https://images.unsplash.com/photo-1641133292545-32e441e60190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZXJlbmdldGklMjBzYWZhcmklMjB3aWxkbGlmZXxlbnwxfHx8fDE3Njc4NzU1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'PARK005', name: 'Lake Manyara', entrance: 50000, guide: 40000, camping: 25000, location: 'Northern Tanzania', description: 'Tree-climbing lions', image: 'https://images.unsplash.com/photo-1641133292545-32e441e60190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZXJlbmdldGklMjBzYWZhcmklMjB3aWxkbGlmZXxlbnwxfHx8fDE3Njc4NzU1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
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

  // Quick Book Destinations
  const quickBookDestinations = [
    {
      name: 'Zanzibar Paradise',
      subtitle: 'Beach & Culture',
      image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxaYW56aWJhciUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NzkwMTQ4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      from: 25000,
      gradient: 'from-cyan-500 to-blue-600',
      popular: true
    },
    {
      name: 'Serengeti Safari',
      subtitle: 'Wildlife Adventure',
      image: 'https://images.unsplash.com/photo-1641133292545-32e441e60190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZXJlbmdldGklMjBzYWZhcmklMjB3aWxkbGlmZXxlbnwxfHx8fDE3Njc4NzU1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      from: 280000,
      gradient: 'from-amber-500 to-orange-600',
      popular: true
    },
    {
      name: 'Kilimanjaro Trek',
      subtitle: 'Summit Africa',
      image: 'https://images.unsplash.com/photo-1518729571365-9a891a9df2bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3VudCUyMEtpbGltYW5qYXJvfGVufDF8fHx8MTc2NzkwMTQ4OXww&ixlib=rb-4.1.0&q=80&w=1080',
      from: 80000,
      gradient: 'from-purple-500 to-pink-600',
      popular: false
    },
    {
      name: 'Dar es Salaam',
      subtitle: 'City Exploration',
      image: 'https://images.unsplash.com/photo-1707299311857-abdc17b9dc06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYXIlMjBlcyUyMFNhbGFhbSUyMGNpdHl8ZW58MXx8fHwxNzY3OTAxNDkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      from: 75000,
      gradient: 'from-green-500 to-emerald-600',
      popular: false
    }
  ];

  // Main menu view
  if (!currentMode) {
    // Check if unified booking system should be shown
    if (showUnifiedBooking && selectedBookingService) {
      return (
        <UnifiedBookingSystem
          user={user}
          onBack={() => {
            setShowUnifiedBooking(false);
            setSelectedBookingService(null);
          }}
          initialService={selectedBookingService}
        />
      );
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/20 pb-6">
        {/* Hero Header with Gradient */}
        <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 px-6 pt-8 pb-32 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={onBack}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all active:scale-95"
              >
                <ArrowLeft className="size-5 text-white" />
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">Explore Tanzania</h1>
                <p className="text-green-100 text-sm flex items-center gap-2">
                  <Sparkles className="size-4" />
                  Book your perfect journey
                </p>
              </div>
            </div>

            {/* Loyalty Points Banner */}
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-400 p-2.5 rounded-xl">
                  <Star className="size-5 text-amber-900" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">GO Rewards Points</p>
                  <p className="text-green-100 text-xs">Earn 5% on every booking</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{user.loyaltyPoints || 0}</p>
                <p className="text-green-100 text-xs">points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Book Destinations - Horizontal Scroll */}
        <div className="px-6 -mt-20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">✨ Popular Destinations</h2>
            <button className="text-sm text-green-600 font-medium flex items-center gap-1">
              View All
              <ChevronRight className="size-4" />
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            {quickBookDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-64 relative rounded-3xl overflow-hidden shadow-xl group cursor-pointer"
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${dest.gradient} opacity-60`}></div>
                  
                  {dest.popular && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <TrendingUp className="size-3.5 text-red-500" />
                      <span className="text-xs font-semibold text-gray-900">Trending</span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-xl mb-1">{dest.name}</h3>
                    <p className="text-white/90 text-sm mb-3">{dest.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <span className="text-xs opacity-90">From</span>
                        <p className="text-lg font-bold">{formatCurrency(dest.from)}</p>
                      </div>
                      <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Options - Enhanced Cards */}
        <div className="px-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🚀 Book Your Journey</h2>
          
          {/* Flights */}
          <button
            onClick={() => {
              setSelectedBookingService('flights');
              setShowUnifiedBooking(true);
            }}
            className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border border-blue-100 hover:border-blue-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <Plane className="size-7 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-900 mb-1">Domestic Flights</p>
                  <p className="text-sm text-gray-500">Fast & convenient air travel</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">40+ Routes</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Same Day</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-6 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Ferry to Zanzibar - Featured */}
          <button
            onClick={() => setCurrentMode('ferry')}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform border border-white/30">
                  <Ship className="size-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-lg font-bold text-white">Ferry to Zanzibar</p>
                    <Zap className="size-4 text-yellow-300" />
                  </div>
                  <p className="text-sm text-cyan-100 mb-2">Fast & scenic ocean journey</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white/25 backdrop-blur-sm text-white px-2 py-1 rounded-full font-medium border border-white/30">2-4 Hours</span>
                    <span className="text-xs bg-white/25 backdrop-blur-sm text-white px-2 py-1 rounded-full font-medium border border-white/30">From {formatCurrency(25000)}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-6 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Bus */}
          <button
            onClick={() => {
              setSelectedBookingService('buses');
              setShowUnifiedBooking(true);
            }}
            className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border border-green-100 hover:border-green-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-green-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <Bus className="size-7 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-900 mb-1">Luxury Buses</p>
                  <p className="text-sm text-gray-500">Comfortable intercity coaches</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">VIP Available</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-6 text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* SGR Train */}
          <button
            onClick={() => {
              setSelectedBookingService('sgr');
              setShowUnifiedBooking(true);
            }}
            className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border border-red-100 hover:border-red-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-red-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <Train className="size-7 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-900 mb-1">SGR Train</p>
                  <p className="text-sm text-gray-500">Modern railway experience</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">Dar → Morogoro</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-6 text-red-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Hotels */}
          <button
            onClick={() => {
              setSelectedBookingService('hotels');
              setShowUnifiedBooking(true);
            }}
            className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border border-orange-100 hover:border-orange-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <Hotel className="size-7 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-900 mb-1">Hotels & Lodges</p>
                  <p className="text-sm text-gray-500">Luxury to budget stays</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">500+ Properties</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-6 text-orange-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* National Parks */}
          <button
            onClick={() => {
              setSelectedBookingService('parks');
              setShowUnifiedBooking(true);
            }}
            className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border border-emerald-100 hover:border-emerald-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <Mountain className="size-7 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-900 mb-1">National Parks</p>
                  <p className="text-sm text-gray-500">Safari & adventure packages</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">UNESCO Sites</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-6 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* AI Travel Tips */}
        <div className="px-6 mt-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="relative flex items-start gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <Sparkles className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold mb-1">AI Travel Assistant</p>
                <p className="text-purple-100 text-sm mb-3">Get personalized travel recommendations and smart booking tips</p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-50 transition-colors shadow-lg">
                  Ask AI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="px-6 mt-6 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 text-center shadow-md">
              <Shield className="size-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">Secure Payment</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-md">
              <Check className="size-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">Instant Confirm</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-md">
              <Heart className="size-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">Best Prices</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (searchStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
          {/* Success Animation Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
              <Check className="size-12 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-8">Your journey awaits — bon voyage! 🎉</p>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 mb-6 text-left border border-gray-200">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Booking Reference</span>
                <span className="font-mono text-green-600 font-bold text-lg">{bookingReference}</span>
              </div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Travel Type</span>
                <span className="capitalize font-semibold text-gray-900">{currentMode}</span>
              </div>
              {selectedBooking && (
                <>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <span className="text-sm text-gray-500 font-medium">Route</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedBooking.from} → {selectedBooking.to || selectedBooking.location || selectedBooking.name}</span>
                  </div>
                  {searchData.departDate && (
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-500 font-medium">Travel Date</span>
                      <span className="text-sm font-semibold text-gray-900">{new Date(searchData.departDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                  {selectedBooking.departure && (
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-500 font-medium">Departure Time</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedBooking.departure}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <span className="text-sm text-gray-500 font-medium">Passengers</span>
                    <span className="text-sm font-semibold text-gray-900">{searchData.passengers || searchData.rooms || searchData.visitors}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">Amount Paid</span>
                    <span className="text-green-600 font-bold text-lg">{formatCurrency(selectedBooking.price * (searchData.passengers || searchData.rooms || searchData.visitors))}</span>
                  </div>
                </>
              )}
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6 text-sm text-blue-900 flex items-start gap-3">
              <Info className="size-5 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold mb-1">E-Ticket Sent!</p>
                <p>Your e-ticket has been sent to <span className="font-semibold">{user.email}</span></p>
              </div>
            </div>

            <Button
              onClick={resetBooking}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all mb-3"
            >
              <Ticket className="size-5 mr-2" />
              Book Another Trip
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full h-14 rounded-2xl text-base font-semibold border-2"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Payment screen
  if (searchStep === 'payment') {
    const totalAmount = selectedBooking ? selectedBooking.price * (searchData.passengers || searchData.rooms || searchData.visitors) : 0;
    
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 px-6 pt-8 pb-12 rounded-b-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl"></div>
          <div className="relative flex items-center gap-4 mb-4">
            <button
              onClick={() => setSearchStep('details')}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Confirm Payment</h1>
          </div>
        </div>

        <div className="px-6 -mt-6 space-y-4">
          {/* Payment Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="size-5 text-green-600" />
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Base Price</span>
                <span className="font-semibold">{formatCurrency(selectedBooking?.price || 0)}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Quantity</span>
                <span className="font-semibold">× {searchData.passengers || searchData.rooms || searchData.visitors}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-semibold">{formatCurrency(1000)}</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount + 1000)}</span>
              </div>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 shadow-xl text-white">
            <p className="text-green-100 text-sm mb-2">Available Balance</p>
            <p className="text-3xl font-bold mb-1">{formatCurrency(user.balance || 0)}</p>
            {user.balance && user.balance >= (totalAmount + 1000) ? (
              <div className="flex items-center gap-2 text-green-100 text-sm">
                <Check className="size-4" />
                <span>Sufficient balance</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-200 text-sm">
                <AlertCircle className="size-4" />
                <span>Please top up your wallet</span>
              </div>
            )}
          </div>

          {/* PIN Input */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <Label className="text-gray-900 font-semibold mb-3 block">Enter 4-Digit PIN</Label>
            <Input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="text-center text-2xl tracking-widest h-16 rounded-2xl border-2 focus:border-green-500"
            />
          </div>

          {/* Security Note */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <Shield className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Secure Transaction</p>
              <p>Your payment is encrypted and protected by goPay security</p>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirmPayment}
            disabled={pin.length !== 4}
            className="w-full h-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm & Pay {formatCurrency(totalAmount + 1000)}
          </Button>
        </div>
      </div>
    );
  }

  // Details Screen
  if (searchStep === 'details' && selectedBooking) {
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 px-6 pt-8 pb-12 rounded-b-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl"></div>
          <div className="relative flex items-center gap-4">
            <button
              onClick={() => setSearchStep('results')}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Booking Details</h1>
              <p className="text-green-100 text-sm">Review your selection</p>
            </div>
          </div>
        </div>

        <div className="px-6 -mt-6 space-y-4">
          {/* Booking Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedBooking.airline || selectedBooking.company || selectedBooking.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  {selectedBooking.type || selectedBooking.class || `${selectedBooking.rating} ★`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedBooking.price)}</p>
                <p className="text-xs text-gray-500">per person/night</p>
              </div>
            </div>

            {/* Route/Location Info */}
            {selectedBooking.from && selectedBooking.to && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-500 mb-1">From</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.from}</p>
                    {selectedBooking.departure && (
                      <p className="text-sm text-gray-600 mt-1">{selectedBooking.departure}</p>
                    )}
                  </div>
                  <div className="px-4">
                    <ArrowRight className="size-6 text-green-600" />
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-500 mb-1">To</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.to}</p>
                    {selectedBooking.arrival && (
                      <p className="text-sm text-gray-600 mt-1">{selectedBooking.arrival}</p>
                    )}
                  </div>
                </div>
                {selectedBooking.duration && (
                  <div className="text-center mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Duration: <span className="font-semibold text-gray-900">{selectedBooking.duration}</span></p>
                  </div>
                )}
              </div>
            )}

            {/* Amenities for hotels */}
            {selectedBooking.amenities && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.amenities.map((amenity: string, idx: number) => (
                    <span key={idx} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                      {amenity === 'WiFi' && <Wifi className="size-3.5" />}
                      {amenity === 'Restaurant' && <UtensilsCrossed className="size-3.5" />}
                      {amenity === 'Pool' && <Waves className="size-3.5" />}
                      {amenity === 'Beach' && <TreePalm className="size-3.5" />}
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Seats Available */}
            {selectedBooking.seats && (
              <div className="flex items-center gap-2 text-sm">
                <div className={`flex items-center gap-1.5 ${selectedBooking.seats < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                  <Info className="size-4" />
                  <span className="font-medium">{selectedBooking.seats} seats available</span>
                </div>
              </div>
            )}
          </div>

          {/* Passenger/Room Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <Label className="text-gray-900 font-semibold mb-4 block flex items-center gap-2">
              <Users className="size-5 text-green-600" />
              {currentMode === 'hotels' ? 'Number of Rooms' : currentMode === 'parks' ? 'Number of Visitors' : 'Number of Passengers'}
            </Label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const key = currentMode === 'hotels' ? 'rooms' : currentMode === 'parks' ? 'visitors' : 'passengers';
                  if (searchData[key] > 1) {
                    setSearchData({ ...searchData, [key]: searchData[key] - 1 });
                  }
                }}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-colors"
              >
                <span className="text-2xl font-bold text-gray-700">−</span>
              </button>
              <div className="flex-1 text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {currentMode === 'hotels' ? searchData.rooms : currentMode === 'parks' ? searchData.visitors : searchData.passengers}
                </p>
              </div>
              <button
                onClick={() => {
                  const key = currentMode === 'hotels' ? 'rooms' : currentMode === 'parks' ? 'visitors' : 'passengers';
                  if (searchData[key] < (selectedBooking.seats || 10)) {
                    setSearchData({ ...searchData, [key]: searchData[key] + 1 });
                  }
                }}
                className="bg-green-600 hover:bg-green-700 p-3 rounded-xl transition-colors"
              >
                <span className="text-2xl font-bold text-white">+</span>
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Price</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(selectedBooking.price * (searchData.passengers || searchData.rooms || searchData.visitors))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm">You'll earn</p>
                <p className="text-xl font-bold text-amber-300">
                  +{Math.floor(selectedBooking.price * (searchData.passengers || searchData.rooms || searchData.visitors) * 0.05)} pts
                </p>
              </div>
            </div>
          </div>

          {/* Proceed to Payment */}
          <Button
            onClick={handleProceedToPayment}
            className="w-full h-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    );
  }

  // Results Screen (Render based on mode)
  if (searchStep === 'results') {
    const results = currentMode === 'flights' ? mockFlights : 
                    currentMode === 'bus' ? mockBuses :
                    currentMode === 'ferry' ? mockFerries :
                    currentMode === 'train' ? mockTrains :
                    currentMode === 'hotels' ? mockHotels :
                    currentMode === 'parks' ? mockParks : [];

    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 px-6 pt-8 pb-12 rounded-b-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl"></div>
          <div className="relative flex items-center gap-4 mb-4">
            <button
              onClick={() => setSearchStep('search')}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white capitalize">{currentMode} Results</h1>
              <p className="text-green-100 text-sm">{results.length} options found</p>
            </div>
          </div>
        </div>

        <div className="px-6 -mt-6 space-y-3">
          {results.map((item: any) => (
            <button
              key={item.id}
              onClick={() => handleSelectBooking(item)}
              className="w-full bg-white rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-green-300 text-left"
            >
              {currentMode === 'hotels' || currentMode === 'parks' ? (
                <>
                  {item.image && (
                    <div className="w-full h-40 rounded-2xl overflow-hidden mb-4">
                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.location || item.description}</p>
                      {item.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`size-4 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(item.price || item.entrance)}</p>
                      <p className="text-xs text-gray-500">per night</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.airline || item.company}</h3>
                      <p className="text-sm text-gray-500">{item.type || item.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(item.price)}</p>
                      <p className="text-xs text-gray-500">{item.seats} seats left</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                    <div className="text-center flex-1">
                      <p className="text-sm text-gray-500 mb-1">{item.from}</p>
                      <p className="font-semibold text-gray-900 text-lg">{item.departure}</p>
                    </div>
                    <div className="px-4">
                      <div className="flex flex-col items-center">
                        <ArrowRight className="size-5 text-green-600" />
                        <p className="text-xs text-gray-500 mt-1">{item.duration}</p>
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-sm text-gray-500 mb-1">{item.to}</p>
                      <p className="font-semibold text-gray-900 text-lg">{item.arrival}</p>
                    </div>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Search Form Screen
  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 px-6 pt-8 pb-12 rounded-b-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl"></div>
        <div className="relative flex items-center gap-4">
          <button
            onClick={resetBooking}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="size-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">{currentMode}</h1>
            <p className="text-green-100 text-sm">Search and book your journey</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl space-y-4">
          {(currentMode === 'flights' || currentMode === 'bus' || currentMode === 'ferry' || currentMode === 'train') && (
            <>
              <div>
                <Label className="text-gray-900 font-semibold mb-2 block flex items-center gap-2">
                  <MapPin className="size-4 text-green-600" />
                  From
                </Label>
                <Input
                  type="text"
                  placeholder="Enter city"
                  value={searchData.from}
                  onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                  className="h-12 rounded-xl border-2 focus:border-green-500"
                  list="cities-from"
                />
                <datalist id="cities-from">
                  {tanzaniaCities.map(city => <option key={city} value={city} />)}
                </datalist>
              </div>

              <div>
                <Label className="text-gray-900 font-semibold mb-2 block flex items-center gap-2">
                  <MapPin className="size-4 text-green-600" />
                  To
                </Label>
                <Input
                  type="text"
                  placeholder="Enter destination"
                  value={searchData.to}
                  onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                  className="h-12 rounded-xl border-2 focus:border-green-500"
                  list="cities-to"
                />
                <datalist id="cities-to">
                  {tanzaniaCities.map(city => <option key={city} value={city} />)}
                </datalist>
              </div>

              <div>
                <Label className="text-gray-900 font-semibold mb-2 block flex items-center gap-2">
                  <Calendar className="size-4 text-green-600" />
                  Departure Date
                </Label>
                <Input
                  type="date"
                  value={searchData.departDate}
                  onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
                  className="h-12 rounded-xl border-2 focus:border-green-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label className="text-gray-900 font-semibold mb-2 block flex items-center gap-2">
                  <Users className="size-4 text-green-600" />
                  Passengers
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={searchData.passengers}
                  onChange={(e) => setSearchData({ ...searchData, passengers: parseInt(e.target.value) || 1 })}
                  className="h-12 rounded-xl border-2 focus:border-green-500"
                />
              </div>
            </>
          )}

          {currentMode === 'hotels' && (
            <>
              <div>
                <Label className="text-gray-900 font-semibold mb-2 block flex items-center gap-2">
                  <MapPin className="size-4 text-green-600" />
                  Location
                </Label>
                <Input
                  type="text"
                  placeholder="Enter city or hotel name"
                  value={searchData.from}
                  onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                  className="h-12 rounded-xl border-2 focus:border-green-500"
                  list="cities-hotels"
                />
                <datalist id="cities-hotels">
                  {tanzaniaCities.map(city => <option key={city} value={city} />)}
                </datalist>
              </div>

              <div>
                <Label className="text-gray-900 font-semibold mb-2 block flex items-center gap-2">
                  <Calendar className="size-4 text-green-600" />
                  Check-in Date
                </Label>
                <Input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                  className="h-12 rounded-xl border-2 focus:border-green-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label className="text-gray-900 font-semibold mb-2 block flex items-center gap-2">
                  <Calendar className="size-4 text-green-600" />
                  Check-out Date
                </Label>
                <Input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                  className="h-12 rounded-xl border-2 focus:border-green-500"
                  min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label className="text-gray-900 font-semibold mb-2 block flex items-center gap-2">
                  <Hotel className="size-4 text-green-600" />
                  Number of Rooms
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={searchData.rooms}
                  onChange={(e) => setSearchData({ ...searchData, rooms: parseInt(e.target.value) || 1 })}
                  className="h-12 rounded-xl border-2 focus:border-green-500"
                />
              </div>
            </>
          )}

          {currentMode === 'parks' && (
            <>
              <div>
                <Label className="text-gray-900 font-semibold mb-2 block flex items-center gap-2">
                  <Mountain className="size-4 text-green-600" />
                  Select Park
                </Label>
                <Input
                  type="text"
                  placeholder="Enter park name"
                  value={searchData.parkName}
                  onChange={(e) => setSearchData({ ...searchData, parkName: e.target.value })}
                  className="h-12 rounded-xl border-2 focus:border-green-500"
                  list="parks-list"
                />
                <datalist id="parks-list">
                  {mockParks.map(park => <option key={park.id} value={park.name} />)}
                </datalist>
              </div>

              <div>
                <Label className="text-gray-900 font-semibold mb-2 block flex items-center gap-2">
                  <Calendar className="size-4 text-green-600" />
                  Visit Date
                </Label>
                <Input
                  type="date"
                  value={searchData.departDate}
                  onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
                  className="h-12 rounded-xl border-2 focus:border-green-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label className="text-gray-900 font-semibold mb-2 block flex items-center gap-2">
                  <Users className="size-4 text-green-600" />
                  Number of Visitors
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={searchData.visitors}
                  onChange={(e) => setSearchData({ ...searchData, visitors: parseInt(e.target.value) || 1 })}
                  className="h-12 rounded-xl border-2 focus:border-green-500"
                />
              </div>
            </>
          )}

          <Button
            onClick={handleSearch}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all mt-6"
          >
            <Search className="size-5 mr-2" />
            Search {currentMode}
          </Button>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mt-4 flex items-start gap-3">
          <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Travel Tip</p>
            <p>
              {currentMode === 'flights' && 'Book early for the best fares. Peak season is June-September.'}
              {currentMode === 'bus' && 'VIP buses offer more comfort for long journeys.'}
              {currentMode === 'ferry' && 'Fast ferries save time but cost more than standard ferries.'}
              {currentMode === 'train' && 'Business class offers more space and amenities.'}
              {currentMode === 'hotels' && 'Book during off-peak season for better rates.'}
              {currentMode === 'parks' && 'Hire a guide for the best wildlife spotting experience.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
