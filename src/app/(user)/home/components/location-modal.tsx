"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2, Navigation } from "lucide-react";

interface LocationData {
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  formatted_address: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: { city: string; state: string; country: string } | null;
  onLocationUpdate: (location: LocationData) => void;
}

export function LocationModal({ 
  isOpen, 
  onClose, 
  currentLocation, 
  onLocationUpdate 
}: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search for locations using Google Places API
  const searchLocations = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const locations: LocationData[] = data.results.slice(0, 5).map((result: any) => {
          const addressComponents = result.address_components;
          let city = '';
          let state = '';
          let country = '';

          for (const component of addressComponents) {
            if (component.types.includes('locality')) {
              city = component.long_name;
            } else if (component.types.includes('administrative_area_level_2') && !city) {
              city = component.long_name;
            } else if (component.types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (component.types.includes('country')) {
              country = component.long_name;
            }
          }

          return {
            city: city || 'Unknown',
            state,
            country,
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            formatted_address: result.formatted_address,
          };
        });

        setSearchResults(locations);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(searchQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setGettingCurrentLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Get address from coordinates
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();

          if (data.status === 'OK' && data.results.length > 0) {
            const result = data.results[0];
            const addressComponents = result.address_components;
            
            let city = '';
            let state = '';
            let country = '';
            
            for (const component of addressComponents) {
              if (component.types.includes('locality')) {
                city = component.long_name;
              } else if (component.types.includes('administrative_area_level_2') && !city) {
                city = component.long_name;
              } else if (component.types.includes('administrative_area_level_1')) {
                state = component.long_name;
              } else if (component.types.includes('country')) {
                country = component.long_name;
              }
            }

            const locationData: LocationData = {
              city: city || 'Unknown',
              state,
              country,
              lat: latitude,
              lng: longitude,
              formatted_address: result.formatted_address,
            };

            onLocationUpdate(locationData);
            onClose();
          }
        } catch (error) {
          console.error('Error getting address from coordinates:', error);
          alert('Failed to get address for your current location.');
        } finally {
          setGettingCurrentLocation(false);
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
        setGettingCurrentLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location access denied by user.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out.");
            break;
          default:
            alert("An unknown error occurred while getting location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleLocationSelect = (location: LocationData) => {
    onLocationUpdate(location);
    onClose();
  };

  const resetModal = () => {
    setSearchQuery("");
    setSearchResults([]);
    setLoading(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Change Location
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Location Display */}
          {currentLocation && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Current location:</p>
              <p className="font-medium">
                {currentLocation.city}, {currentLocation.state}
              </p>
            </div>
          )}

          {/* Get Current Location Button */}
          <Button
            onClick={getCurrentLocation}
            disabled={gettingCurrentLocation}
            className="w-full"
            variant="outline"
          >
            {gettingCurrentLocation ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting location...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
                Use Current Location
              </>
            )}
          </Button>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a city or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <p className="text-sm text-muted-foreground">Search results:</p>
              {searchResults.map((location, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 text-left"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {location.city}, {location.state}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {location.formatted_address}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchQuery.length >= 3 && !loading && searchResults.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No locations found for "{searchQuery}"</p>
              <p className="text-sm">Try searching with a different term</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}