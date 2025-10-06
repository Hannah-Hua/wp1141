import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Chip,
  Rating,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Favorite as HeartIcon,
  FavoriteBorder as HeartBorderIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product | null;
  onBack: () => void;
  onFavoriteToggle?: (productId: number) => void;
  favorites?: number[];
  onAddToCart?: (product: Product, selectedOption?: string, quantity?: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack, 
  onFavoriteToggle, 
  favorites = [],
  onAddToCart
}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showOptionError, setShowOptionError] = useState(false);

  // 檢查商品是否需要選項
  const needsOption = product && (product.category === 'Apparel/Hoodie' || product.category === 'Apparel/Tour T-shirt');

  // 處理加入購物車
  const handleAddToCart = () => {
    if (!product) return;

    // 檢查是否需要選項但未選擇
    if (needsOption && !selectedOption) {
      setShowOptionError(true);
      return;
    }

    setShowOptionError(false);
    onAddToCart?.(product, selectedOption || undefined, quantity);
  };

  // 處理數量變化
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.max_purchase_qty || 10)) {
      setQuantity(newQuantity);
    }
  };

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6">商品不存在</Typography>
      </Container>
    );
  }

  // 判斷是否需要顯示尺寸選項
  const showSizeOption = product.category === 'Apparel/Hoodie' || product.category === 'Apparel/Tour T‑shirt';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 返回按鈕 */}
      <IconButton
        onClick={onBack}
        sx={{
          mb: 2,
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Grid container spacing={4}>
        {/* 商品圖片區域 */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: '#f8f8f8',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              minHeight: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative', // 添加相對定位
            }}
          >
            {/* 商品標籤 */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
              {product.limited_edition && (
                <Chip
                  label="限量版"
                  size="small"
                  sx={{
                    backgroundColor: '#f50057',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                  }}
                />
              )}
              {product.preorder && (
                <Chip
                  label="預購"
                  size="small"
                  sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </Box>

            {/* 商品圖片佔位符 */}
            <Typography
              variant="h6"
              sx={{
                color: '#666',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              商品圖片
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              {product.product_name}
            </Typography>
          </Box>
        </Grid>

        {/* 商品詳細資訊區域 */}
        <Grid item xs={12} md={6}>
          {/* 店家列 */}
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            店家列
          </Typography>

          {/* 商品名稱 */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              lineHeight: 1.3,
            }}
          >
            {product.product_name}
          </Typography>

          {/* 愛心按鈕 */}
          <IconButton
            onClick={() => onFavoriteToggle?.(product.product_id)}
            sx={{
              mb: 2,
              p: 1,
              color: favorites.includes(product.product_id) ? '#ff1744' : '#666',
              '&:hover': {
                backgroundColor: '#ffebee',
                color: '#ff1744',
              },
            }}
          >
{favorites.includes(product.product_id) ? (
              <HeartIcon />
            ) : (
              <HeartBorderIcon />
            )}
          </IconButton>

          <Divider sx={{ my: 2 }} />

          {/* 價格 */}
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            NT$ {product.price_twd.toLocaleString()}
          </Typography>


          {/* 出貨時間 */}
          <Typography variant="h6" sx={{ mb: 3 }}>
            {product.shipping_days_estimate} 天內出貨
          </Typography>

          {/* 商品庫存 */}
          <Typography variant="body1" sx={{ mb: 2 }}>
            商品庫存： {product.stock}件
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* 尺寸選項 */}
          {needsOption && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                OPTION
              </Typography>
              <FormControl fullWidth error={showOptionError}>
                <InputLabel>- [必須]請選擇一個選項-</InputLabel>
                <Select
                  value={selectedOption}
                  onChange={(e) => {
                    setSelectedOption(e.target.value);
                    setShowOptionError(false);
                  }}
                  label="- [必須]請選擇一個選項-"
                >
                  <MenuItem value="L">L</MenuItem>
                  <MenuItem value="M">M</MenuItem>
                  <MenuItem value="S">S</MenuItem>
                </Select>
              </FormControl>
              {showOptionError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  請選擇商品選項
                </Typography>
              )}
            </Box>
          )}

          {/* 數量選擇 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              數量
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                sx={{ minWidth: 40, height: 40 }}
              >
                -
              </Button>
              <Typography 
                variant="h6" 
                sx={{ 
                  minWidth: 60, 
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                {quantity}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= (product.max_purchase_qty || 10)}
                sx={{ minWidth: 40, height: 40 }}
              >
                +
              </Button>
            </Box>
            <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
              最多可購買 {product.max_purchase_qty || 10} 件
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 商品資訊 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
              團體: {product.group_name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
              分類: {product.category}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
              評分: {product.rating} ({product.sold_count.toLocaleString()} 件已售出)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} readOnly precision={0.1} />
            </Box>

            {/* 商品描述 */}
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
              {product.description}
            </Typography>
          </Box>

          {/* 總價顯示 */}
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f8f8', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              商品總計
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000' }}>
              NT$ {(product.price_twd * quantity).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {quantity} 件 × NT$ {product.price_twd.toLocaleString()}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 加入購物車和立即購買按鈕 */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                flex: 1,
                backgroundColor: 'red',
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
              onClick={handleAddToCart}
            >
              加入購物車
            </Button>
            
            <Button
              variant="contained"
              sx={{
                flex: 1,
                backgroundColor: 'black',
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
              onClick={() => {
                // TODO: 實作立即購買功能
                console.log('立即購買:', product.product_name);
              }}
            >
              立刻購買
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
