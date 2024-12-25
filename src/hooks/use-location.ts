"use client";

import { useState, useEffect } from 'react';

interface LocationState {
  loading: boolean;
  error: string | null;
  location: string;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    loading: true,
    error: null,
    location: '',
  });

  useEffect(() => {
    async function getLocation() {
      try {
        // First try to get location from browser
        if ('geolocation' in navigator) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          // Use Google's Geocoding API to get address from coordinates
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          
          const data = await response.json();
          
          if (data.results && data.results[0]) {
            setState({
              loading: false,
              error: null,
              location: data.results[0].formatted_address,
            });
          }
        } else {
          setState({
            loading: false,
            error: 'Geolocation is not supported',
            location: '',
          });
        }
      } catch (error) {
        setState({
          loading: false,
          error: 'Failed to get location',
          location: '',
        });
      }
    }

    getLocation();
  }, []);

  return state;
}