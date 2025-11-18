import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User } from '../App';
import { 
  ArrowLeft, Film, MapPin, Clock, Calendar, Star, Ticket, 
  CreditCard, ChevronRight, Search, Play, Users, X, Check
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MoviesPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface Movie {
  id: string;
  title: string;
  rating: number;
  genre: string;
  duration: string;
  image: string;
  trailer: string;
  description: string;
  releaseDate: string;
}

interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
  facilities: string[];
  image: string;
}

interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  time: string;
  date: string;
  price: number;
  availableSeats: number;
  format: string; // 2D, 3D, IMAX
}

export function MoviesPage({ user, accessToken, onBack }: MoviesPageProps) {
  const [activeView, setActiveView] = useState<'movies' | 'theaters' | 'booking' | 'checkout' | 'success'>('movies');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('gopay');
  const [balance, setBalance] = useState(450000);

  // All 12 payment methods
  const paymentMethods = [
    { id: 'gopay', name: 'goPay Wallet', icon: 'wallet', balance: balance, processingFee: 0 },
    { id: 'card', name: 'Debit/Credit Card', icon: 'card', processingFee: 0.025 },
    { id: 'mpesa', name: 'M-Pesa', icon: 'mobile', processingFee: 0.01 },
    { id: 'tigopesa', name: 'Tigo Pesa', icon: 'mobile', processingFee: 0.01 },
    { id: 'airtelmoney', name: 'Airtel Money', icon: 'mobile', processingFee: 0.01 },
    { id: 'halopesa', name: 'Halopesa', icon: 'mobile', processingFee: 0.01 },
    { id: 'ezypesa', name: 'EzyPesa', icon: 'mobile', processingFee: 0.01 },
    { id: 'crdb', name: 'CRDB Bank', icon: 'bank', processingFee: 0.015 },
    { id: 'nmb', name: 'NMB Bank', icon: 'bank', processingFee: 0.015 },
    { id: 'nbc', name: 'NBC Bank', icon: 'bank', processingFee: 0.015 },
    { id: 'equity', name: 'Equity Bank', icon: 'bank', processingFee: 0.015 },
    { id: 'stanbic', name: 'Stanbic Bank', icon: 'bank', processingFee: 0.015 },
  ];

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/balance`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Tanzania Movie Theaters
  const theaters: Theater[] = [
    // DAR ES SALAAM - Main commercial hub with most cinemas
    {
      id: 'century-cinemax-mlimani',
      name: 'Century Cinemax - Mlimani City',
      location: 'Mlimani City Mall, Sam Nujoma Road',
      city: 'Dar es Salaam',
      facilities: ['IMAX', '3D', 'VIP Lounge', 'Dolby Atmos', 'Recliner Seats'],
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'century-cinemax-peninsula',
      name: 'Century Cinemax - Peninsula',
      location: 'Peninsula Mall, Masaki',
      city: 'Dar es Salaam',
      facilities: ['3D', 'VIP Seats', 'Premium Sound', 'Snack Bar'],
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'century-cinemax-quality',
      name: 'Century Cinemax - Quality Center',
      location: 'Quality Center Mall, Kinondoni',
      city: 'Dar es Salaam',
      facilities: ['3D', 'Recliner Seats', 'Snack Bar', 'Premium Sound'],
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'century-cinemax-city-mall',
      name: 'Century Cinemax - City Mall',
      location: 'City Mall, Kisutu',
      city: 'Dar es Salaam',
      facilities: ['3D', 'Family Seats', 'Snack Bar'],
      image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'leader-club-cinema-slipway',
      name: 'Leader Club Cinema - Slipway',
      location: 'Slipway Shopping Centre, Msasani',
      city: 'Dar es Salaam',
      facilities: ['3D', 'VIP Lounge', 'Ocean View', 'Premium Sound'],
      image: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'cinemax-sea-cliff',
      name: 'Century Cinemax - Sea Cliff',
      location: 'Sea Cliff Village, Masaki',
      city: 'Dar es Salaam',
      facilities: ['3D', 'Premium Seats', 'Snack Bar', 'Dolby Sound'],
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'cinemax-oyster-bay',
      name: 'Oyster Bay Cinema',
      location: 'Oyster Bay Shopping Center',
      city: 'Dar es Salaam',
      facilities: ['3D', 'VIP Seats', 'Cafe'],
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'cineplex-mikocheni',
      name: 'Mikocheni Cineplex',
      location: 'Mikocheni Plaza',
      city: 'Dar es Salaam',
      facilities: ['3D', 'Snack Bar', 'Parking'],
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'ster-kinekor-dar',
      name: 'Ster-Kinekor Dar es Salaam',
      location: 'Mlimani City, Upper Level',
      city: 'Dar es Salaam',
      facilities: ['IMAX', '3D', 'VIP Lounge', 'Premium Sound'],
      image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'cineplex-mbezi-beach',
      name: 'Mbezi Beach Cinema',
      location: 'Mbezi Beach, Africana Mall',
      city: 'Dar es Salaam',
      facilities: ['3D', 'Family Seats', 'Food Court'],
      image: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },

    // ARUSHA - Tourist hub with growing cinema scene
    {
      id: 'cinemax-arusha-tfa',
      name: 'Century Cinemax - Arusha',
      location: 'TFA Tower, Sokoine Road',
      city: 'Arusha',
      facilities: ['3D', 'VIP Lounge', 'Premium Sound', 'Parking'],
      image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'arusha-blue-plaza',
      name: 'Blue Plaza Cinema',
      location: 'Blue Plaza Mall, Njiro',
      city: 'Arusha',
      facilities: ['3D', 'Snack Bar', 'Modern Screens'],
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'arusha-central-cinema',
      name: 'Arusha Central Cinema',
      location: 'Clock Tower, City Center',
      city: 'Arusha',
      facilities: ['3D', 'VIP Seats', 'Cafe'],
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'njiro-complex-cinema',
      name: 'Njiro Complex Cinema',
      location: 'Njiro Complex Mall',
      city: 'Arusha',
      facilities: ['3D', 'Family Seats', 'Snack Bar'],
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'arusha-movie-palace',
      name: 'Arusha Movie Palace',
      location: 'Makao Mapya, Stadium Area',
      city: 'Arusha',
      facilities: ['3D', 'Premium Sound', 'Parking'],
      image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },

    // MWANZA - Lake Victoria region entertainment hub
    {
      id: 'cinemax-mwanza-lake',
      name: 'Century Cinemax - Mwanza',
      location: 'Lake Mall, Isamilo',
      city: 'Mwanza',
      facilities: ['3D', 'Family Seats', 'Snack Bar', 'Lake View'],
      image: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'mwanza-city-cinema',
      name: 'Mwanza City Cinema',
      location: 'CCM Kirumba, City Center',
      city: 'Mwanza',
      facilities: ['3D', 'VIP Seats', 'Premium Sound'],
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'lake-victoria-cinema',
      name: 'Lake Victoria Cineplex',
      location: 'Capri Point, Isamilo',
      city: 'Mwanza',
      facilities: ['3D', 'Recliner Seats', 'Cafe', 'Panoramic Views'],
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'mwanza-rock-cinema',
      name: 'Rock City Cinema',
      location: 'Rock City Mall, Nyakato',
      city: 'Mwanza',
      facilities: ['3D', 'Family Seats', 'Snack Bar'],
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'isamilo-cineplex',
      name: 'Isamilo Entertainment Center',
      location: 'Isamilo Road',
      city: 'Mwanza',
      facilities: ['3D', 'VIP Lounge', 'Gaming Zone'],
      image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },

    // DODOMA - Capital city with modern facilities
    {
      id: 'cinemax-dodoma-capital',
      name: 'Century Cinemax - Dodoma',
      location: 'Capital City Mall, Kijitonyama',
      city: 'Dodoma',
      facilities: ['3D', 'VIP Seats', 'Premium Sound', 'Modern Screens'],
      image: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'dodoma-city-cinema',
      name: 'Dodoma City Cinema',
      location: 'Makole Area, Near Parliament',
      city: 'Dodoma',
      facilities: ['3D', 'Snack Bar', 'Parking'],
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'capital-plaza-cinema',
      name: 'Capital Plaza Cineplex',
      location: 'Dodoma City Center',
      city: 'Dodoma',
      facilities: ['3D', 'VIP Lounge', 'Cafe', 'Premium Sound'],
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'dodoma-movie-house',
      name: 'Dodoma Movie House',
      location: 'Iyumbu, Commercial Area',
      city: 'Dodoma',
      facilities: ['3D', 'Family Seats', 'Snack Bar'],
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
    {
      id: 'parliament-cinema',
      name: 'Parliament Cinema Complex',
      location: 'Chamwino, Near Bunge',
      city: 'Dodoma',
      facilities: ['3D', 'Premium Seats', 'Modern Facilities'],
      image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    }
  ];

  // Current & Upcoming Movies in Tanzania
  const movies: Movie[] = [
    {
      id: 'sonic-3',
      title: 'Sonic the Hedgehog 3',
      rating: 4.7,
      genre: 'Action, Adventure, Comedy',
      duration: '109 min',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      trailer: 'https://youtube.com/watch?v=qSu6i2iFMO0',
      description: 'Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow.',
      releaseDate: '2024-12-20'
    },
    {
      id: 'mufasa',
      title: 'Mufasa: The Lion King',
      rating: 4.8,
      genre: 'Animation, Adventure, Drama',
      duration: '118 min',
      image: 'https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      trailer: 'https://youtube.com/watch?v=o17MF9vnabg',
      description: 'The origin story of Mufasa, exploring his journey from orphaned cub to King of the Pride Lands.',
      releaseDate: '2024-12-20'
    },
    {
      id: 'wicked',
      title: 'Wicked',
      rating: 4.9,
      genre: 'Fantasy, Musical, Romance',
      duration: '160 min',
      image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      trailer: 'https://youtube.com/watch?v=6COmYeLsz4c',
      description: 'The untold story of the Witches of Oz, revealing the events that hardened the Wicked Witch\'s heart.',
      releaseDate: '2024-11-22'
    },
    {
      id: 'moana-2',
      title: 'Moana 2',
      rating: 4.6,
      genre: 'Animation, Adventure, Musical',
      duration: '100 min',
      image: 'https://images.unsplash.com/photo-1574267432644-f610a4ab6a4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      trailer: 'https://youtube.com/watch?v=hDZ7y8RP5HE',
      description: 'Moana embarks on an expansive new voyage alongside a crew of unlikely seafarers.',
      releaseDate: '2024-11-27'
    },
    {
      id: 'kraven',
      title: 'Kraven the Hunter',
      rating: 4.3,
      genre: 'Action, Adventure, Thriller',
      duration: '127 min',
      image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      trailer: 'https://youtube.com/watch?v=rze8QYwWGMs',
      description: 'Russian immigrant Sergei Kravinoff is on a mission to prove he is the greatest hunter in the world.',
      releaseDate: '2024-12-13'
    },
    {
      id: 'nosferatu',
      title: 'Nosferatu',
      rating: 4.8,
      genre: 'Horror, Fantasy',
      duration: '132 min',
      image: 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      trailer: 'https://youtube.com/watch?v=l14WwUYSkMY',
      description: 'A gothic tale of obsession between a haunted young woman and the terrifying vampire infatuated with her.',
      releaseDate: '2024-12-25'
    }
  ];

  // Generate showtimes
  const generateShowtimes = (movieId: string, theaterId: string): Showtime[] => {
    const times = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'];
    const formats = ['2D', '3D', 'IMAX'];
    const dates = ['Today', 'Tomorrow', 'Dec 25', 'Dec 26', 'Dec 27'];
    
    return times.map((time, index) => ({
      id: `${movieId}-${theaterId}-${index}`,
      movieId,
      theaterId,
      time,
      date: dates[index % dates.length],
      price: formats[index % formats.length] === 'IMAX' ? 25000 : formats[index % formats.length] === '3D' ? 18000 : 12000,
      availableSeats: Math.floor(Math.random() * 50) + 20,
      format: formats[index % formats.length]
    }));
  };

  const handleBookTicket = async () => {
    if (!selectedMovie || !selectedTheater || !selectedShowtime || !pin) return;

    setProcessing(true);
    try {
      const ticketAmount = selectedShowtime.price * selectedSeats;
      const commission = Math.round(ticketAmount * 0.15); // 15% goPay commission
      const selectedPayment = paymentMethods.find(p => p.id === paymentMethod);
      const processingFee = selectedPayment ? Math.round(ticketAmount * selectedPayment.processingFee) : 0;
      const totalFees = commission + processingFee;
      const totalAmount = ticketAmount + totalFees;
      const theaterAmount = ticketAmount - commission; // Theater gets base amount minus commission

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/movies/book`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            movieId: selectedMovie.id,
            movieTitle: selectedMovie.title,
            theaterId: selectedTheater.id,
            theaterName: selectedTheater.name,
            showtimeId: selectedShowtime.id,
            showtime: selectedShowtime.time,
            showDate: selectedShowtime.date,
            seats: selectedSeats,
            ticketAmount,
            commission,
            processingFee,
            totalFees,
            totalAmount,
            theaterAmount,
            paymentMethod,
            pin
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBookingRef(data.bookingReference);
        setActiveView('success');
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking ticket:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Movies List View
  if (activeView === 'movies') {
    const filteredMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Movies</h1>
                <p className="text-sm text-gray-500">Now showing in Tanzania</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-2 gap-4">
            {filteredMovies.map((movie) => (
              <button
                key={movie.id}
                onClick={() => {
                  setSelectedMovie(movie);
                  setActiveView('theaters');
                }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="relative h-64">
                  <ImageWithFallback
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="size-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{movie.rating}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{movie.genre}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="size-3" />
                    <span>{movie.duration}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* View Theaters Button */}
        <div className="fixed bottom-6 left-0 right-0 px-4">
          <button
            onClick={() => setActiveView('theaters')}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-full font-bold shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="size-5" />
            View All Theaters
          </button>
        </div>
      </div>
    );
  }

  // Theaters View
  if (activeView === 'theaters') {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setActiveView('movies')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Select Theater</h1>
              {selectedMovie && (
                <p className="text-sm text-gray-500">{selectedMovie.title}</p>
              )}
            </div>
          </div>
        </div>

        {/* Theaters List */}
        <div className="px-4 py-6 space-y-4">
          {theaters.map((theater) => (
            <button
              key={theater.id}
              onClick={() => {
                setSelectedTheater(theater);
                setActiveView('booking');
              }}
              className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
            >
              <div className="relative h-40">
                <ImageWithFallback
                  src={theater.image}
                  alt={theater.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-lg mb-1">{theater.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="size-4" />
                    <span>{theater.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {theater.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Booking View - Select Showtime
  if (activeView === 'booking') {
    const showtimes = selectedMovie && selectedTheater 
      ? generateShowtimes(selectedMovie.id, selectedTheater.id)
      : [];

    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('theaters')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{selectedMovie?.title}</h1>
              <p className="text-sm text-gray-500">{selectedTheater?.name}</p>
            </div>
          </div>
        </div>

        {/* Showtimes */}
        <div className="px-4 py-6">
          <h2 className="text-lg font-bold mb-4">Select Date & Time</h2>
          <div className="space-y-4">
            {showtimes.map((showtime) => (
              <button
                key={showtime.id}
                onClick={() => {
                  setSelectedShowtime(showtime);
                  setActiveView('checkout');
                }}
                className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-purple-500 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                      {showtime.format}
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{showtime.time}</p>
                      <p className="text-sm text-gray-500">{showtime.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">TZS {showtime.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{showtime.availableSeats} seats left</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Checkout View
  if (activeView === 'checkout') {
    const ticketAmount = selectedShowtime ? selectedShowtime.price * selectedSeats : 0;
    const commission = Math.round(ticketAmount * 0.15); // Your 15% profit
    const selectedPayment = paymentMethods.find(p => p.id === paymentMethod);
    const processingFee = selectedPayment ? Math.round(ticketAmount * selectedPayment.processingFee) : 0;
    const totalFees = commission + processingFee;
    const totalAmount = ticketAmount + totalFees;

    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('booking')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Booking Summary */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
            <h2 className="font-bold text-xl mb-4">{selectedMovie?.title}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span>{selectedTheater?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{selectedShowtime?.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>{selectedShowtime?.time} - {selectedShowtime?.format}</span>
              </div>
            </div>
          </div>

          {/* Number of Seats */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Users className="size-5" />
              Number of Seats
            </h3>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setSelectedSeats(Math.max(1, selectedSeats - 1))}
                className="w-12 h-12 bg-gray-100 rounded-full font-bold text-xl hover:bg-gray-200 transition-all"
              >
                −
              </button>
              <span className="text-3xl font-bold w-16 text-center">{selectedSeats}</span>
              <button
                onClick={() => setSelectedSeats(Math.min(10, selectedSeats + 1))}
                className="w-12 h-12 bg-gray-100 rounded-full font-bold text-xl hover:bg-gray-200 transition-all"
              >
                +
              </button>
            </div>
          </div>

          {/* Payment Methods - All 12 Options */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="font-bold mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    paymentMethod === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    paymentMethod === method.id ? 'bg-green-500' : 'bg-gray-100'
                  }`}>
                    {method.icon === 'wallet' && <CreditCard className={`size-6 ${paymentMethod === method.id ? 'text-white' : 'text-gray-600'}`} />}
                    {method.icon === 'card' && <CreditCard className={`size-6 ${paymentMethod === method.id ? 'text-white' : 'text-gray-600'}`} />}
                    {method.icon === 'mobile' && <CreditCard className={`size-6 ${paymentMethod === method.id ? 'text-white' : 'text-gray-600'}`} />}
                    {method.icon === 'bank' && <CreditCard className={`size-6 ${paymentMethod === method.id ? 'text-white' : 'text-gray-600'}`} />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold">{method.name}</p>
                    {method.balance !== undefined ? (
                      <p className="text-sm text-gray-600">Balance: TZS {method.balance.toLocaleString()}</p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {method.processingFee > 0 ? `${(method.processingFee * 100).toFixed(1)}% fee` : 'No fee'}
                      </p>
                    )}
                  </div>
                  {paymentMethod === method.id && (
                    <Check className="size-6 text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold mb-2">Payment Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ticket Price ({selectedSeats} {selectedSeats > 1 ? 'seats' : 'seat'} × TZS {(selectedShowtime?.price || 0).toLocaleString()})</span>
              <span className="font-semibold">TZS {ticketAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">goPay Commission (15%)</span>
              <span className="font-semibold text-green-600">TZS {commission.toLocaleString()}</span>
            </div>
            {processingFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processing Fee ({selectedPayment?.name})</span>
                <span className="font-semibold text-orange-600">TZS {processingFee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total Fees</span>
              <span>TZS {totalFees.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold text-xl text-green-600">TZS {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* PIN */}
          <div>
            <label className="block font-bold mb-2">Enter PIN to Confirm</label>
            <Input
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="h-14 text-center text-2xl tracking-widest"
            />
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleBookTicket}
            disabled={processing || pin.length !== 4}
            className="w-full h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {processing ? (
              'Processing...'
            ) : (
              `Pay TZS ${totalAmount.toLocaleString()}`
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to the terms & conditions
          </p>
        </div>
      </div>
    );
  }

  // Success View
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="size-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your movie tickets have been booked successfully
        </p>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Booking Reference</span>
            <span className="font-bold">{bookingRef}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Movie</span>
            <span className="font-semibold">{selectedMovie?.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Theater</span>
            <span className="font-semibold">{selectedTheater?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Showtime</span>
            <span className="font-semibold">{selectedShowtime?.date} - {selectedShowtime?.time}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Seats</span>
            <span className="font-semibold">{selectedSeats}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Show this reference at the theater counter to collect your tickets
        </p>

        <Button
          onClick={onBack}
          className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full font-bold"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}