#!/bin/bash

# 辦公咖啡廳清單 API 測試腳本

BASE_URL="http://localhost:3000"

echo "==========================================="
echo "  辦公咖啡廳清單 API 測試"
echo "==========================================="
echo ""

# 測試伺服器連線
echo "1. 測試伺服器連線..."
curl -s $BASE_URL | python3 -m json.tool
echo ""
echo "-------------------------------------------"

# 登入（先登入而不是註冊，因為可能已經註冊過）
echo "2. 測試登入..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

echo "$LOGIN_RESPONSE" | python3 -m json.tool

# 提取 Token（嘗試多種方法）
TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))" 2>/dev/null)

# 如果登入失敗（可能還沒註冊），則嘗試註冊
if [ -z "$TOKEN" ]; then
  echo ""
  echo "登入失敗，嘗試註冊新使用者..."
  REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"測試使用者","email":"test@example.com","password":"password123"}')
  
  echo "$REGISTER_RESPONSE" | python3 -m json.tool
  TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))" 2>/dev/null)
fi

echo ""
echo "✅ Token 已取得: ${TOKEN:0:50}..."
echo ""
echo "-------------------------------------------"

# 新增咖啡廳
echo "3. 測試新增咖啡廳..."
curl -s -X POST $BASE_URL/api/cafes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"測試咖啡廳",
    "description":"這是一間很棒的咖啡廳，適合工作",
    "address":"台北市信義區信義路五段7號",
    "category":"辦公友善",
    "rating":4.5,
    "priceLevel":2,
    "hasWifi":true,
    "hasPowerOutlets":true,
    "hasTimeLimit":false,
    "isNoisy":false,
    "hasGoodLighting":true,
    "hasAvailableSeats":true
  }' | python3 -m json.tool
echo ""
echo "-------------------------------------------"

# 取得咖啡廳列表
echo "4. 測試取得咖啡廳列表..."
curl -s $BASE_URL/api/cafes | python3 -m json.tool
echo ""
echo "-------------------------------------------"

# 新增到訪記錄
echo "5. 測試新增到訪記錄..."
curl -s -X POST $BASE_URL/api/visits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cafeId":1,
    "visitDate":"2025-10-22",
    "notes":"環境很棒，咖啡也好喝",
    "rating":5
  }' | python3 -m json.tool
echo ""
echo "-------------------------------------------"

# 取得到訪記錄
echo "6. 測試取得到訪記錄..."
curl -s $BASE_URL/api/visits \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""
echo "-------------------------------------------"

# 加入願望清單
echo "7. 測試加入願望清單..."
curl -s -X POST $BASE_URL/api/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cafeId":1,
    "notes":"想去試試看他們的手沖咖啡"
  }' | python3 -m json.tool
echo ""
echo "-------------------------------------------"

# 取得願望清單
echo "8. 測試取得願望清單..."
curl -s $BASE_URL/api/wishlist \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""
echo "-------------------------------------------"

echo ""
echo "==========================================="
echo "  測試完成！"
echo "==========================================="

