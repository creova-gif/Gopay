import { useState } from 'react';
import { User } from '../App';
import { FlightSearch } from './FlightSearch';
import { FerryBookingPage } from './FerryBookingPage';
import { BusBookingPage } from './BusBookingPage';
import { SGRBookingPage } from './SGRBookingPage';
import { HotelSearchPage } from './HotelSearchPage';
import { NationalParksBookingPage } from './NationalParksBookingPage';
import { AITravelAssistant } from './AITravelAssistant';
import { CarRentalPage } from './CarRentalPage';

export type BookingService = 'flights' | 'ferry' | 'buses' | 'sgr' | 'hotels' | 'parks' | 'ai' | 'cars';

interface Props {
  user: User;
  accessToken: string;
  onBack: () => void;
  initialService?: BookingService;
}

export function UnifiedBookingSystemUltimate({ user, accessToken, onBack, initialService = 'flights' }: Props) {
  const [activeService, setActiveService] = useState<BookingService>(initialService);

  const navigateTo = (service: string) => {
    const valid: BookingService[] = ['flights', 'ferry', 'buses', 'sgr', 'hotels', 'parks', 'ai', 'cars'];
    if (valid.includes(service as BookingService)) {
      setActiveService(service as BookingService);
    }
  };

  switch (activeService) {
    case 'flights':
      return <FlightSearch accessToken={accessToken} onBack={onBack} />;

    case 'ferry':
      return <FerryBookingPage user={user} accessToken={accessToken} onBack={onBack} />;

    case 'buses':
      return <BusBookingPage user={user} accessToken={accessToken} onBack={onBack} />;

    case 'sgr':
      return <SGRBookingPage user={user} accessToken={accessToken} onBack={onBack} />;

    case 'hotels':
      return <HotelSearchPage accessToken={accessToken} onBack={onBack} />;

    case 'parks':
      return <NationalParksBookingPage user={user} accessToken={accessToken} onBack={onBack} />;

    case 'cars':
      return <CarRentalPage user={user} accessToken={accessToken} onBack={onBack} />;

    case 'ai':
      return <AITravelAssistant user={user} accessToken={accessToken} onBack={onBack} onNavigate={navigateTo} />;

    default:
      return <FlightSearch accessToken={accessToken} onBack={onBack} />;
  }
}
