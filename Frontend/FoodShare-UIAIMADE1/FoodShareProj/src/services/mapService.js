import axios from 'axios';

// API configuration
// Using Mapbox for this implementation, but easily adaptable to Google Maps
const API_TYPE = import.meta.env.VITE_MAP_API_PROVIDER || 'mapbox'; // 'mapbox' or 'google'
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Service for map-related functionality and location services
 * Handles geocoding, routing, and distance calculations
 */
class MapService {
  /**
   * Convert a human-readable address to coordinates (latitude/longitude)
   * @param {string} address - The address to geocode
   * @returns {Promise<Object>} - Object with lat and lng properties
   */
  async getCoordinates(address) {
    try {
      if (API_TYPE === 'mapbox') {
        // Mapbox Forward Geocoding
        const encodedAddress = encodeURIComponent(address);
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              limit: 1
            }
          }
        );
        
        if (response.data.features && response.data.features.length > 0) {
          const [lng, lat] = response.data.features[0].center;
          return {
            lat,
            lng,
            fullAddress: response.data.features[0].place_name
          };
        }
        throw new Error('Address not found');
      } else {
        // Google Maps Geocoding API
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              address: address,
              key: GOOGLE_MAPS_API_KEY
            }
          }
        );
        
        if (response.data.results && response.data.results.length > 0) {
          const location = response.data.results[0].geometry.location;
          return {
            lat: location.lat,
            lng: location.lng,
            fullAddress: response.data.results[0].formatted_address
          };
        }
        throw new Error('Address not found');
      }
    } catch (error) {
      this._handleError(error, 'Failed to geocode address');
    }
  }

  /**
   * Convert coordinates to a human-readable address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<string>} - Full address
   */
  async getAddressFromCoords(lat, lng) {
    try {
      if (API_TYPE === 'mapbox') {
        // Mapbox Reverse Geocoding
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              limit: 1
            }
          }
        );
        
        if (response.data.features && response.data.features.length > 0) {
          return response.data.features[0].place_name;
        }
        throw new Error('Location not found');
      } else {
        // Google Maps Reverse Geocoding
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              latlng: `${lat},${lng}`,
              key: GOOGLE_MAPS_API_KEY
            }
          }
        );
        
        if (response.data.results && response.data.results.length > 0) {
          return response.data.results[0].formatted_address;
        }
        throw new Error('Location not found');
      }
    } catch (error) {
      this._handleError(error, 'Failed to reverse geocode coordinates');
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {Object} coord1 - Starting point {lat, lng}
   * @param {Object} coord2 - Ending point {lat, lng}
   * @returns {number} - Distance in kilometers
   */
  calculateDistance(coord1, coord2) {
    // Implementation of Haversine formula for direct distance calculation
    const R = 6371; // Earth's radius in kilometers
    const dLat = this._toRadians(coord2.lat - coord1.lat);
    const dLng = this._toRadians(coord2.lng - coord1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._toRadians(coord1.lat)) * Math.cos(this._toRadians(coord2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    
    return parseFloat(distance.toFixed(2));
  }

  /**
   * Get a route between two coordinates
   * @param {Object} startCoords - Starting point {lat, lng}
   * @param {Object} endCoords - Ending point {lat, lng}
   * @returns {Promise<Object>} - Route information including path coordinates
   */
  async getRouteMap(startCoords, endCoords) {
    try {
      if (API_TYPE === 'mapbox') {
        // Mapbox Directions API
        const response = await axios.get(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              geometries: 'geojson',
              overview: 'full',
              steps: true
            }
          }
        );
        
        if (response.data.routes && response.data.routes.length > 0) {
          const route = response.data.routes[0];
          return {
            distance: route.distance / 1000, // Convert to km
            duration: route.duration / 60, // Convert to minutes
            coordinates: route.geometry.coordinates.map(([lng, lat]) => ({ lng, lat })),
            steps: route.legs[0].steps,
            polyline: route.geometry
          };
        }
        throw new Error('Route not found');
      } else {
        // Google Maps Directions API
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/directions/json',
          {
            params: {
              origin: `${startCoords.lat},${startCoords.lng}`,
              destination: `${endCoords.lat},${endCoords.lng}`,
              key: GOOGLE_MAPS_API_KEY
            }
          }
        );
        
        if (response.data.routes && response.data.routes.length > 0) {
          const route = response.data.routes[0];
          
          return {
            distance: route.legs[0].distance.value / 1000, // Convert to km
            duration: route.legs[0].duration.value / 60, // Convert to minutes
            coordinates: [], // This needs the polyline package to decode properly
            steps: route.legs[0].steps,
            polyline: route.overview_polyline.points
          };
        }
        throw new Error('Route not found');
      }
    } catch (error) {
      this._handleError(error, 'Failed to get route map');
    }
  }

  /**
   * Get estimated time of arrival between two points
   * @param {Object} startCoords - Starting point {lat, lng}
   * @param {Object} endCoords - Ending point {lat, lng}
   * @returns {Promise<Object>} - ETA information
   */
  async getETA(startCoords, endCoords) {
    try {
      if (API_TYPE === 'mapbox') {
        // Reuse route functionality to get ETA
        const route = await this.getRouteMap(startCoords, endCoords);
        
        const now = new Date();
        const arrival = new Date(now.getTime() + route.duration * 60000);
        
        return {
          duration: route.duration, // minutes
          distance: route.distance, // km
          estimatedArrival: arrival,
          trafficLevel: 'normal', // Mapbox doesn't provide this directly
          formattedETA: `${Math.floor(route.duration)} minutes (${route.distance.toFixed(1)} km)`
        };
      } else {
        // Google Maps Distance Matrix API for more accurate ETA
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/distancematrix/json',
          {
            params: {
              origins: `${startCoords.lat},${startCoords.lng}`,
              destinations: `${endCoords.lat},${endCoords.lng}`,
              departure_time: 'now',
              key: GOOGLE_MAPS_API_KEY
            }
          }
        );
        
        if (response.data.rows && response.data.rows[0].elements) {
          const element = response.data.rows[0].elements[0];
          const durationInMinutes = element.duration.value / 60;
          const durationInTrafficMinutes = 
            element.duration_in_traffic?.value / 60 || durationInMinutes;
          
          const now = new Date();
          const arrival = new Date(now.getTime() + durationInTrafficMinutes * 60000);
          
          return {
            duration: durationInTrafficMinutes, // minutes
            distance: element.distance.value / 1000, // km
            estimatedArrival: arrival,
            trafficLevel: this._determineTrafficLevel(durationInMinutes, durationInTrafficMinutes),
            formattedETA: `${Math.floor(durationInTrafficMinutes)} minutes (${(element.distance.value / 1000).toFixed(1)} km)`
          };
        }
        throw new Error('Failed to calculate ETA');
      }
    } catch (error) {
      this._handleError(error, 'Failed to get estimated arrival time');
    }
  }

  /**
   * Get the current location of a delivery
   * @param {string} deliveryId - ID of the delivery to track
   * @returns {Promise<Object>} - Delivery location data
   */
  async getDeliveryLocation(deliveryId) {
    try {
      // In a real app, this would connect to a real-time tracking API
      // For now, we'll simulate a response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return simulated location (for development purposes)
      return {
        lat: 37.7749 + (Math.random() * 0.01 - 0.005),
        lng: -122.4194 + (Math.random() * 0.01 - 0.005),
        address: "123 Delivery Street, San Francisco, CA",
        timestamp: new Date().toISOString(),
        eta: Math.floor(Math.random() * 30) + 5 + " minutes",
        speed: Math.floor(Math.random() * 30) + 20 + " km/h",
        deliveryStatus: "In Transit"
      };
    } catch (error) {
      this._handleError(error, 'Failed to get delivery location');
    }
  }

  /**
   * Initialize a map instance in the provided container
   * For use with React components that need a map
   * @param {string} containerId - DOM ID of the map container
   * @param {Object} options - Map initialization options
   * @returns {Object} - Map instance and control methods
   */
  initializeMap(containerId, options = {}) {
    // This is a placeholder - actual implementation would depend on
    // the specific map library you're using (e.g., Mapbox GL JS or Google Maps JS API)
    
    if (API_TYPE === 'mapbox') {
      // For a real implementation, you'd need to import mapboxgl
      // const mapboxgl = require('mapbox-gl');
      // mapboxgl.accessToken = MAPBOX_TOKEN;
      
      return {
        createMarker: (coords, options) => {
          // Create a marker at the given coordinates
        },
        addPolyline: (coordinates) => {
          // Add a polyline to the map
        },
        fitBounds: (bounds) => {
          // Fit the map to the given bounds
        },
        // Additional map control methods
      };
    } else {
      // Google Maps implementation
      return {
        createMarker: (coords, options) => {
          // Create a marker with Google Maps
        },
        addPolyline: (coordinates) => {
          // Add a polyline to the Google Map
        },
        fitBounds: (bounds) => {
          // Fit the map to the given bounds
        },
        // Additional map control methods
      };
    }
  }

  /**
   * Convert degrees to radians
   * @private
   * @param {number} degrees - Angle in degrees
   * @returns {number} - Angle in radians
   */
  _toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Determine traffic level based on regular duration vs. traffic duration
   * @private
   * @param {number} regularDuration - Duration without traffic
   * @param {number} trafficDuration - Duration with traffic
   * @returns {string} - Traffic level description
   */
  _determineTrafficLevel(regularDuration, trafficDuration) {
    const ratio = trafficDuration / regularDuration;
    
    if (ratio < 1.1) return 'light';
    if (ratio < 1.3) return 'moderate';
    if (ratio < 1.5) return 'heavy';
    return 'severe';
  }

  /**
   * Handle API errors consistently
   * @private
   * @param {Error} error - The error object
   * @param {string} defaultMessage - Default error message
   */
  _handleError(error, defaultMessage) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      defaultMessage;
    
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}

// Create singleton instance
const mapService = new MapService();

// Export individual methods for direct import
export const {
  getCoordinates,
  getAddressFromCoords,
  calculateDistance,
  getRouteMap,
  getETA,
  initializeMap,
  getDeliveryLocation
} = mapService;

// Export the entire service as default
export default mapService;
