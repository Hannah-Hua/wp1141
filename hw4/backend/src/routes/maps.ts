import { Router, Request, Response } from 'express';
import * as googleMapsService from '../services/googleMapsService';

const router = Router();

// Geocoding - 地址轉座標
router.post('/geocode', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: '請提供地址' });
    }

    const result = await googleMapsService.geocodeAddress(address);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Geocoding 錯誤:', error);
    res.status(500).json({ 
      error: 'Geocoding 失敗',
      message: error.message,
    });
  }
});

// Reverse Geocoding - 座標轉地址
router.post('/reverse-geocode', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: '請提供座標' });
    }

    const result = await googleMapsService.reverseGeocode(latitude, longitude);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Reverse Geocoding 錯誤:', error);
    res.status(500).json({ 
      error: 'Reverse Geocoding 失敗',
      message: error.message,
    });
  }
});

// 搜尋附近的咖啡廳（Places API）
router.post('/nearby', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: '請提供座標' });
    }

    const places = await googleMapsService.searchNearbyPlaces(
      latitude,
      longitude,
      radius || 1000
    );
    
    res.json({
      success: true,
      places,
      count: places.length,
    });
  } catch (error: any) {
    console.error('Nearby Search 錯誤:', error);
    res.status(500).json({ 
      error: '搜尋附近咖啡廳失敗',
      message: error.message,
    });
  }
});

// 文字搜尋咖啡廳（Places API）
router.post('/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: '請提供搜尋關鍵字' });
    }

    const places = await googleMapsService.searchPlaces(query);
    
    res.json({
      success: true,
      places,
      count: places.length,
    });
  } catch (error: any) {
    console.error('Text Search 錯誤:', error);
    res.status(500).json({ 
      error: '搜尋咖啡廳失敗',
      message: error.message,
    });
  }
});

// 取得地點詳細資訊（Places API）
router.get('/place/:placeId', async (req: Request, res: Response) => {
  try {
    const { placeId } = req.params;

    const details = await googleMapsService.getPlaceDetails(placeId);
    
    res.json({
      success: true,
      data: details,
    });
  } catch (error: any) {
    console.error('Place Details 錯誤:', error);
    res.status(500).json({ 
      error: '取得地點詳情失敗',
      message: error.message,
    });
  }
});

// 路線規劃（Directions API）
router.post('/directions', async (req: Request, res: Response) => {
  try {
    const { origin, destination, mode } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: '請提供起點和終點' });
    }

    const directions = await googleMapsService.getDirections(
      origin,
      destination,
      mode || 'transit'
    );
    
    res.json({
      success: true,
      data: directions,
    });
  } catch (error: any) {
    console.error('Directions 錯誤:', error);
    res.status(500).json({ 
      error: '路線規劃失敗',
      message: error.message,
    });
  }
});

export default router;

