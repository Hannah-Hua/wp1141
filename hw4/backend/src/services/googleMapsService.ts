import axios from 'axios';

const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

// 取得 API Key（runtime 讀取）
function getApiKey(): string {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY || '';
  if (!key) {
    throw new Error('GOOGLE_MAPS_SERVER_KEY 未設定在環境變數中');
  }
  return key;
}

// Geocoding API - 地址轉座標
export async function geocodeAddress(address: string) {
  try {
    const GOOGLE_MAPS_API_KEY = getApiKey();

    console.log('Geocoding 請求:', address);
    console.log('使用 API Key:', GOOGLE_MAPS_API_KEY.substring(0, 10) + '...');

    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        address,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    console.log('Geocoding 回應狀態:', response.data.status);

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
      };
    } else {
      const errorMsg = response.data.error_message || response.data.status;
      throw new Error(`Geocoding 失敗: ${errorMsg}`);
    }
  } catch (error: any) {
    console.error('Geocoding API 錯誤:', error.response?.data || error.message);
    throw error;
  }
}

// Reverse Geocoding - 座標轉地址
export async function reverseGeocode(latitude: number, longitude: number) {
  try {
    const GOOGLE_MAPS_API_KEY = getApiKey();
    
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        latlng: `${latitude},${longitude}`,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      return {
        address: response.data.results[0].formatted_address,
        placeId: response.data.results[0].place_id,
      };
    } else {
      throw new Error(`Reverse Geocoding 失敗: ${response.data.status}`);
    }
  } catch (error: any) {
    console.error('Reverse Geocoding API 錯誤:', error.message);
    throw error;
  }
}

// Places API - 搜尋附近的咖啡廳
export async function searchNearbyPlaces(latitude: number, longitude: number, radius: number = 1000) {
  try {
    const GOOGLE_MAPS_API_KEY = getApiKey();
    
    const response = await axios.get(`${PLACES_API_URL}/nearbysearch/json`, {
      params: {
        location: `${latitude},${longitude}`,
        radius,
        type: 'cafe',
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status === 'OK') {
      return response.data.results.map((place: any) => ({
        placeId: place.place_id,
        name: place.name,
        address: place.vicinity,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        rating: place.rating,
        priceLevel: place.price_level,
      }));
    } else {
      throw new Error(`Places API 失敗: ${response.data.status}`);
    }
  } catch (error: any) {
    console.error('Places API 錯誤:', error.message);
    throw error;
  }
}

// Places API - 取得地點詳細資訊
export async function getPlaceDetails(placeId: string) {
  try {
    const GOOGLE_MAPS_API_KEY = getApiKey();
    
    const response = await axios.get(`${PLACES_API_URL}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,formatted_address,geometry,rating,price_level,opening_hours,formatted_phone_number,website',
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status === 'OK') {
      const result = response.data.result;
      return {
        name: result.name,
        address: result.formatted_address,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        rating: result.rating,
        priceLevel: result.price_level,
        phoneNumber: result.formatted_phone_number,
        website: result.website,
        openingHours: result.opening_hours,
      };
    } else {
      throw new Error(`Place Details 失敗: ${response.data.status}`);
    }
  } catch (error: any) {
    console.error('Place Details API 錯誤:', error.message);
    throw error;
  }
}

// Places API - 文字搜尋
export async function searchPlaces(query: string) {
  try {
    const GOOGLE_MAPS_API_KEY = getApiKey();
    
    const response = await axios.get(`${PLACES_API_URL}/textsearch/json`, {
      params: {
        query: `${query} 咖啡廳`,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status === 'OK') {
      return response.data.results.map((place: any) => ({
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        rating: place.rating,
        priceLevel: place.price_level,
      }));
    } else {
      return [];
    }
  } catch (error: any) {
    console.error('Text Search API 錯誤:', error.message);
    throw error;
  }
}

// Directions API - 路線規劃（可選）
export async function getDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  mode: 'driving' | 'walking' | 'transit' = 'transit'
) {
  try {
    const GOOGLE_MAPS_API_KEY = getApiKey();
    
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        mode,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status === 'OK') {
      const route = response.data.routes[0];
      const leg = route.legs[0];
      
      return {
        distance: leg.distance.text,
        duration: leg.duration.text,
        steps: leg.steps.map((step: any) => ({
          instruction: step.html_instructions,
          distance: step.distance.text,
          duration: step.duration.text,
        })),
        polyline: route.overview_polyline.points,
      };
    } else {
      throw new Error(`Directions API 失敗: ${response.data.status}`);
    }
  } catch (error: any) {
    console.error('Directions API 錯誤:', error.message);
    throw error;
  }
}

