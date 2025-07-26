import React, { useState, useEffect, useRef } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation,
  Search,
  Hospital,
  Stethoscope,
  Pill
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HealthcareProvider {
  id: string;
  name: string;
  type: 'dermatologist' | 'doctor' | 'pharmacy';
  rating: number;
  distance: string;
  address: string;
  phone?: string;
  hours?: string;
  location: { lat: number; lng: number };
}

interface HealthcareLocatorProps {
  onClose: () => void;
}

const GOOGLE_MAPS_API_KEY = '';

export const HealthcareLocator = ({ onClose }: HealthcareLocatorProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [providers, setProviders] = useState<HealthcareProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'dermatologist' | 'doctor' | 'pharmacy'>('dermatologist');
  const [apiKey, setApiKey] = useState(GOOGLE_MAPS_API_KEY);
  const [showApiInput, setShowApiInput] = useState(!GOOGLE_MAPS_API_KEY);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const requestLocationPermission = async () => {
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'granted') {
        return true;
      } else {
        toast({
          title: "Location Permission Required",
          description: "Please enable location access to find nearby healthcare providers.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Permission error:', error);
      toast({
        title: "Permission Error",
        description: "Unable to request location permission.",
        variant: "destructive"
      });
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setUserLocation(location);
      toast({
        title: "Location Found",
        description: "Successfully found your current location.",
      });

      return location;
    } catch (error) {
      console.error('Location error:', error);
      toast({
        title: "Location Error",
        description: "Unable to get your current location. Please check your location settings.",
        variant: "destructive"
      });
      setLoading(false);
      return null;
    }
  };

  const initializeMap = async (location: { lat: number; lng: number }) => {
    if (!mapRef.current || !apiKey) return;

    try {
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places']
      });

      const google = await loader.load();
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 14,
        styles: [
          {
            featureType: 'poi.medical',
            elementType: 'geometry',
            stylers: [{ color: '#8B1538' }]
          }
        ]
      });

      // Add user location marker
      new google.maps.Marker({
        position: location,
        map: mapInstance,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#8B1538"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24)
        }
      });

      setMap(mapInstance);
      searchNearbyProviders(mapInstance, location);
    } catch (error) {
      console.error('Map initialization error:', error);
      toast({
        title: "Map Error",
        description: "Unable to load Google Maps. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyProviders = (mapInstance: google.maps.Map, location: { lat: number; lng: number }) => {
    const service = new google.maps.places.PlacesService(mapInstance);
    
    let query = '';
    switch (searchType) {
      case 'dermatologist':
        query = 'dermatologist';
        break;
      case 'doctor':
        query = 'doctor';
        break;
      case 'pharmacy':
        query = 'pharmacy';
        break;
    }

    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 10000, // 10km radius
      query: query,
      fields: ['name', 'rating', 'formatted_address', 'geometry', 'formatted_phone_number', 'opening_hours']
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const providers: HealthcareProvider[] = results.slice(0, 10).map((place, index) => ({
          id: place.place_id || index.toString(),
          name: place.name || 'Unknown',
          type: searchType,
          rating: place.rating || 0,
          distance: calculateDistance(location, {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
          }),
          address: place.formatted_address || 'Address not available',
          phone: place.formatted_phone_number,
          hours: place.opening_hours?.weekday_text?.[new Date().getDay()] || 'Hours not available',
          location: {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
          }
        }));

        setProviders(providers);

        // Add markers for providers
        providers.forEach(provider => {
          const marker = new google.maps.Marker({
            position: provider.location,
            map: mapInstance,
            title: provider.name,
            icon: getMarkerIcon(provider.type)
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 4px 0; font-weight: bold;">${provider.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${provider.address}</p>
                <div style="margin-top: 4px;">
                  <span style="color: #8B1538;">★ ${provider.rating.toFixed(1)}</span>
                  <span style="margin-left: 8px; font-size: 12px;">${provider.distance}</span>
                </div>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstance, marker);
          });
        });
      }
    });
  };

  const calculateDistance = (pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }): string => {
    const R = 6371; // Earth's radius in km
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLon = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const getMarkerIcon = (type: string) => {
    const colors = {
      dermatologist: '#8B1538',
      doctor: '#2563eb',
      pharmacy: '#16a34a'
    };
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${colors[type as keyof typeof colors]}"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(24, 24)
    };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dermatologist': return <Stethoscope className="w-4 h-4" />;
      case 'doctor': return <Hospital className="w-4 h-4" />;
      case 'pharmacy': return <Pill className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const handleSearch = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Maps API key to search for healthcare providers.",
        variant: "destructive"
      });
      return;
    }

    const location = await getCurrentLocation();
    if (location) {
      await initializeMap(location);
    }
  };

  const handleTypeChange = (type: 'dermatologist' | 'doctor' | 'pharmacy') => {
    setSearchType(type);
    if (map && userLocation) {
      setProviders([]);
      searchNearbyProviders(map, userLocation);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-card-medical">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Find Healthcare Providers
          </CardTitle>
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        </div>

        {showApiInput && (
          <Alert>
            <AlertDescription>
              <div className="space-y-3">
                <p>To use the maps feature, please enter your Google Maps API key:</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Google Maps API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    type="password"
                  />
                  <Button 
                    onClick={() => setShowApiInput(false)} 
                    disabled={!apiKey}
                    size="sm"
                  >
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a>
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant={searchType === 'dermatologist' ? 'medical' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('dermatologist')}
            className="flex items-center gap-2"
          >
            <Stethoscope className="w-4 h-4" />
            Dermatologists
          </Button>
          <Button
            variant={searchType === 'doctor' ? 'medical' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('doctor')}
            className="flex items-center gap-2"
          >
            <Hospital className="w-4 h-4" />
            Doctors
          </Button>
          <Button
            variant={searchType === 'pharmacy' ? 'medical' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('pharmacy')}
            className="flex items-center gap-2"
          >
            <Pill className="w-4 h-4" />
            Pharmacies
          </Button>
        </div>

        <Button
          onClick={handleSearch}
          disabled={loading || !apiKey}
          className="w-full md:w-auto"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Finding Location...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Find Nearby {searchType === 'dermatologist' ? 'Dermatologists' : searchType === 'doctor' ? 'Doctors' : 'Pharmacies'}
            </div>
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map */}
          <div className="space-y-4">
            <div 
              ref={mapRef} 
              className="w-full h-96 bg-secondary rounded-lg border"
              style={{ minHeight: '400px' }}
            />
          </div>

          {/* Results List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {providers.length > 0 ? (
              providers.map((provider) => (
                <Card key={provider.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">{provider.name}</h3>
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          {getTypeIcon(provider.type)}
                          {provider.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        {provider.rating.toFixed(1)}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{provider.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        <span>{provider.distance} away</span>
                      </div>

                      {provider.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${provider.phone}`} className="text-primary hover:underline">
                            {provider.phone}
                          </a>
                        </div>
                      )}

                      {provider.hours && (
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{provider.hours}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" asChild>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${provider.location.lat},${provider.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Directions
                        </a>
                      </Button>
                      {provider.phone && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${provider.phone}`}>
                            Call
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                {loading ? 'Searching for providers...' : 'Click "Find Nearby" to search for healthcare providers in your area'}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};