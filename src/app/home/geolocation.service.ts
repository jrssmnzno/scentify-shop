import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
  address?: string;  // Full address from reverse geocoding
  city?: string;      // City name
  country?: string;   // Country name
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private http: HttpClient) { }

  // Get current user location using browser's Geolocation API
  async getCurrentLocation(): Promise<UserLocation> {
    return new Promise(async (resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy || undefined,
            timestamp: position.timestamp
          };

          // Get address from coordinates
          try {
            const geocodedData = await this.reverseGeocode(location.latitude, location.longitude);
            location.address = geocodedData.address;
            location.city = geocodedData.city;
            location.country = geocodedData.country;
          } catch (error) {
            console.warn('Reverse geocoding failed:', error);
            // Location is still valid even if address lookup fails
          }

          resolve(location);
        },
        (error) => {
          let errorMessage = 'Unable to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  // Reverse geocode coordinates to get address
  async reverseGeocode(latitude: number, longitude: number): Promise<{ address: string; city: string; country: string }> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      const response: any = await firstValueFrom(this.http.get(url));
      
      const address = response.address || {};
      const fullAddress = response.display_name || 'Unknown location';
      const city = address.city || address.town || address.village || 'Unknown city';
      const country = address.country || 'Unknown country';

      return {
        address: fullAddress,
        city: city,
        country: country
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Format location for display
  formatLocation(location: UserLocation): string {
    if (location.address) {
      return `📍 ${location.address}`;
    }
    return `📍 ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  // Get Google Maps URL from coordinates
  getMapsUrl(location: UserLocation): string {
    return `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  }

  // Calculate distance between two coordinates (in km)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
