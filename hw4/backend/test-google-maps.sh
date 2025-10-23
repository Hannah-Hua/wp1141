#!/bin/bash

# Google Maps API 測試腳本

BASE_URL="http://localhost:3000"

echo "==========================================="
echo "  Google Maps API 測試"
echo "==========================================="
echo ""

# 檢查環境變數
if [ -f .env ]; then
  source .env
  if [ -z "$GOOGLE_MAPS_SERVER_KEY" ]; then
    echo "❌ 錯誤：未設定 GOOGLE_MAPS_SERVER_KEY"
    echo "請在 .env 檔案中設定您的 Google Maps Server Key"
    exit 1
  fi
  echo "✅ 已找到 GOOGLE_MAPS_SERVER_KEY"
  echo ""
else
  echo "❌ 錯誤：找不到 .env 檔案"
  echo "請複製 .env.example 並填入您的 API Keys"
  exit 1
fi

# 測試1：Geocoding API - 地址轉座標
echo "測試 1: Geocoding API - 地址轉座標"
echo "地址: 台北101"
echo "-------------------------------------------"
curl -s -X POST $BASE_URL/api/maps/geocode \
  -H "Content-Type: application/json" \
  -d '{"address":"台北101"}' | python3 -m json.tool
echo ""
echo "==========================================="
echo ""

# 測試2: Geocoding API - 咖啡廳地址
echo "測試 2: Geocoding API - 咖啡廳地址"
echo "地址: 台北市大安區復興南路一段253號"
echo "-------------------------------------------"
curl -s -X POST $BASE_URL/api/maps/geocode \
  -H "Content-Type: application/json" \
  -d '{"address":"台北市大安區復興南路一段253號"}' | python3 -m json.tool
echo ""
echo "==========================================="
echo ""

# 測試3: Reverse Geocoding - 座標轉地址
echo "測試 3: Reverse Geocoding - 座標轉地址"
echo "座標: 25.0330, 121.5654 (台北101)"
echo "-------------------------------------------"
curl -s -X POST $BASE_URL/api/maps/reverse-geocode \
  -H "Content-Type: application/json" \
  -d '{"latitude":25.0330,"longitude":121.5654}' | python3 -m json.tool
echo ""
echo "==========================================="
echo ""

# 測試4: Places API - 搜尋附近咖啡廳
echo "測試 4: Places API - 搜尋附近咖啡廳"
echo "位置: 台北101 附近 1000 公尺"
echo "-------------------------------------------"
curl -s -X POST $BASE_URL/api/maps/nearby \
  -H "Content-Type: application/json" \
  -d '{"latitude":25.0330,"longitude":121.5654,"radius":1000}' | python3 -m json.tool | head -50
echo ""
echo "（僅顯示前 50 行...）"
echo ""
echo "==========================================="
echo ""

# 測試5: Places API - 文字搜尋
echo "測試 5: Places API - 文字搜尋"
echo "關鍵字: 信義區"
echo "-------------------------------------------"
curl -s -X POST $BASE_URL/api/maps/search \
  -H "Content-Type: application/json" \
  -d '{"query":"信義區"}' | python3 -m json.tool | head -50
echo ""
echo "（僅顯示前 50 行...）"
echo ""
echo "==========================================="
echo ""

# 測試6: Directions API - 路線規劃
echo "測試 6: Directions API - 路線規劃"
echo "從: 台北車站 到: 台北101"
echo "模式: 大眾運輸"
echo "-------------------------------------------"
curl -s -X POST $BASE_URL/api/maps/directions \
  -H "Content-Type: application/json" \
  -d '{
    "origin":{"lat":25.0478,"lng":121.5170},
    "destination":{"lat":25.0330,"lng":121.5654},
    "mode":"transit"
  }' | python3 -m json.tool | head -30
echo ""
echo "（僅顯示前 30 行...）"
echo ""
echo "==========================================="
echo ""

echo "測試完成！"
echo ""
echo "✅ 如果所有測試都有回傳 JSON 資料（包含座標、地址等），"
echo "   表示 Google Maps API 設定正確！"
echo ""
echo "❌ 如果看到錯誤訊息，請檢查："
echo "   1. GOOGLE_MAPS_SERVER_KEY 是否正確"
echo "   2. 是否已啟用 Geocoding、Places、Directions API"
echo "   3. API Key 的限制設定是否正確"

