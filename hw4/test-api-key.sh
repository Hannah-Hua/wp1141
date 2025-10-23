#!/bin/bash

# Google Maps API Key 測試腳本
# 用途：快速驗證 API Key 是否正確設定

echo "==========================================="
echo "  Google Maps API Key 測試"
echo "==========================================="
echo ""

# 提示使用者輸入 API Key
if [ -z "$1" ]; then
  echo "使用方法："
  echo "  ./test-api-key.sh YOUR_SERVER_KEY"
  echo ""
  echo "範例："
  echo "  ./test-api-key.sh AIzaSyAbc123..."
  echo ""
  exit 1
fi

API_KEY="$1"

echo "測試 API Key: ${API_KEY:0:20}..."
echo ""

# 測試 1: Geocoding API - 使用英文地址避免編碼問題
echo "測試 1: Geocoding API（地址轉座標）"
echo "地址: Taipei 101"
echo "-------------------------------------------"

RESPONSE=$(curl -s "https://maps.googleapis.com/maps/api/geocode/json?address=Taipei+101&key=${API_KEY}")

# 檢查狀態
STATUS=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('status', 'ERROR'))" 2>/dev/null)

if [ "$STATUS" = "OK" ]; then
  echo "✅ 成功！"
  echo "$RESPONSE" | python3 -m json.tool | head -20
  echo ""
  echo "✅ Geocoding API 可以使用！"
elif [ "$STATUS" = "REQUEST_DENIED" ]; then
  echo "❌ 失敗：REQUEST_DENIED"
  echo ""
  echo "可能原因："
  echo "1. API Key 不正確"
  echo "2. Geocoding API 未啟用"
  echo "3. API Key 的限制設定有誤"
  echo ""
  echo "完整回應："
  echo "$RESPONSE" | python3 -m json.tool
elif [ "$STATUS" = "OVER_QUERY_LIMIT" ]; then
  echo "❌ 失敗：超過配額限制"
  echo "請檢查 Google Cloud Console 的配額設定"
else
  echo "❌ 失敗：$STATUS"
  echo ""
  echo "完整回應："
  echo "$RESPONSE"
fi

echo ""
echo "==========================================="
echo ""

# 測試 2: Places API - 文字搜尋
echo "測試 2: Places API（文字搜尋）"
echo "關鍵字: coffee shop Taipei"
echo "-------------------------------------------"

RESPONSE2=$(curl -s "https://maps.googleapis.com/maps/api/place/textsearch/json?query=coffee+shop+taipei&key=${API_KEY}")

STATUS2=$(echo "$RESPONSE2" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('status', 'ERROR'))" 2>/dev/null)

if [ "$STATUS2" = "OK" ]; then
  echo "✅ 成功！"
  COUNT=$(echo "$RESPONSE2" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('results', [])))")
  echo "找到 $COUNT 個結果"
  echo ""
  echo "✅ Places API 可以使用！"
elif [ "$STATUS2" = "REQUEST_DENIED" ]; then
  echo "❌ 失敗：REQUEST_DENIED"
  echo "請確認 Places API 已啟用"
else
  echo "❌ 失敗：$STATUS2"
fi

echo ""
echo "==========================================="
echo ""

# 總結
echo "測試總結："
echo ""

if [ "$STATUS" = "OK" ] && [ "$STATUS2" = "OK" ]; then
  echo "🎉 恭喜！您的 API Key 設定正確！"
  echo ""
  echo "下一步："
  echo "1. 將這個 Key 填入 backend/.env 的 GOOGLE_MAPS_SERVER_KEY"
  echo "2. 重啟後端伺服器"
  echo "3. 執行 cd backend && ./test-google-maps.sh"
else
  echo "⚠️ API Key 有問題，請檢查："
  echo ""
  echo "1. 前往 Google Cloud Console"
  echo "   https://console.cloud.google.com/apis/credentials"
  echo ""
  echo "2. 檢查 API Key 設定："
  echo "   - 應用程式限制：IP 位址（開發時留空）"
  echo "   - API 限制：選擇 Geocoding、Places、Directions API"
  echo ""
  echo "3. 確認已啟用所需的 API："
  echo "   https://console.cloud.google.com/apis/library"
  echo "   - Geocoding API"
  echo "   - Places API"
  echo "   - Directions API"
fi

echo ""
echo "==========================================="

