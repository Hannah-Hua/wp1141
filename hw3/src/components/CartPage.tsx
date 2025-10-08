import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Checkbox,
  TextField,
  Divider,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { CartItem } from '../types';
import { getImageWithFallback, DEFAULT_GROUP_IMAGE } from '../utils/groupImages';

interface CartPageProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCloseCart: () => void;
  onCheckout?: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, setCartItems, onCloseCart, onCheckout }) => {
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editingOption, setEditingOption] = useState<string>('');
  const [isClosing, setIsClosing] = useState(false);

  // 當購物車打開時，預設全選所有商品
  React.useEffect(() => {
    if (cartItems.length > 0) {
      const hasUnselectedItems = cartItems.some(item => !item.isSelected);
      if (hasUnselectedItems) {
        setCartItems(prev => prev.map(item => ({ ...item, isSelected: true })));
      }
    }
  }, []); // 空依賴陣列，只在組件掛載時執行一次

  // 處理關閉購物車
  const handleCloseCart = () => {
    setIsClosing(true);
    // 等待動畫完成後再關閉
    setTimeout(() => {
      onCloseCart();
    }, 300); // 與動畫時間一致
  };

  // 更新商品數量
  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // 檢查不能超過庫存數量
    const item = cartItems[index];
    if (newQuantity > item.product.stock) {
      return; // 不允許超過庫存
    }
    
    setCartItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    ));
  };

  // 更新商品選項
  const handleOptionChange = (index: number, newOption: string) => {
    setCartItems(prev => prev.map((item, i) => 
      i === index ? { ...item, selectedOption: newOption } : item
    ));
  };

  // 移除商品
  const handleRemoveItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // 切換商品選中狀態
  const handleToggleSelect = (index: number) => {
    setCartItems(prev => prev.map((item, i) => 
      i === index ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  // 全選/取消全選
  const handleSelectAll = () => {
    const allSelected = cartItems.every(item => item.isSelected);
    setCartItems(prev => prev.map(item => ({ ...item, isSelected: !allSelected })));
  };


  // 計算選中商品總金額
  const calculateSelectedTotal = () => {
    const selectedItems = cartItems.filter(item => item.isSelected);
    const total = selectedItems.reduce((total, item) => {
      const itemTotal = item.product.price_twd * item.quantity;
      return total + itemTotal;
    }, 0);
    return total;
  };

  // 計算選中商品數量
  const selectedCount = cartItems.filter(item => item.isSelected).length;

  // 檢查商品是否需要選項
  const needsOption = (category: string) => {
    return category === 'Apparel/Hoodie' || category === 'Apparel/Tour T-shirt';
  };

  return (
    <>
      {/* 背景遮罩 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1299,
          animation: isClosing ? 'fadeOut 0.3s ease-in' : 'fadeIn 0.3s ease-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
            },
            '100%': {
              opacity: 1,
            },
          },
          '@keyframes fadeOut': {
            '0%': {
              opacity: 1,
            },
            '100%': {
              opacity: 0,
            },
          },
        }}
        onClick={handleCloseCart}
      />
      
      {/* 購物車側邊欄 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px', // 固定寬度
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: isClosing ? 'slideOutToRight 0.3s ease-in' : 'slideInFromRight 0.3s ease-out',
          '@keyframes slideInFromRight': {
            '0%': {
              transform: 'translateX(100%)',
            },
            '100%': {
              transform: 'translateX(0)',
            },
          },
          '@keyframes slideOutToRight': {
            '0%': {
              transform: 'translateX(0)',
            },
            '100%': {
              transform: 'translateX(100%)',
            },
          },
        }}
      >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white',
        flexShrink: 0,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
          購物車 ({cartItems.length}件商品)
        </Typography>
        <IconButton
          onClick={handleCloseCart}
          sx={{
            color: '#666',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              color: '#333',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Cart Items */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              購物車是空的
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              快去選購您喜歡的商品吧！
            </Typography>
          </Box>
        ) : (
          <Box>
            {/* Select All */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2, 
              p: 1.5, 
              backgroundColor: '#f5f5f5', 
              borderRadius: 1 
            }}>
              <Checkbox
                checked={cartItems.length > 0 && cartItems.every(item => item.isSelected)}
                indeterminate={selectedCount > 0 && selectedCount < cartItems.length}
                onChange={handleSelectAll}
                size="small"
              />
              <Typography variant="body2" sx={{ ml: 1, fontSize: '0.9rem' }}>
                全選 ({selectedCount}/{cartItems.length})
              </Typography>
            </Box>

              {/* Items List */}
              {cartItems.map((item, index) => (
                <Card key={`${item.product.product_id}-${item.selectedOption || 'default'}`} sx={{ mb: 1.5, boxShadow: 1 }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      {/* Checkbox */}
                      <Checkbox
                        checked={item.isSelected}
                        onChange={() => handleToggleSelect(index)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />

                      {/* Product Image */}
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: '#f8f8f8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          component="img"
                          src={getImageWithFallback(item.product.group_name)}
                          alt={`${item.product.group_name} 團體合照`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            backgroundColor: '#f8f8f8',
                          }}
                          onError={(e) => {
                            // 當圖片載入失敗時，使用預設圖片
                            const target = e.target as HTMLImageElement;
                            target.src = DEFAULT_GROUP_IMAGE;
                          }}
                        />
                      </Box>

                      {/* Product Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            mb: 0.5,
                            fontSize: '0.9rem',
                            lineHeight: 1.2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.product.product_name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary', 
                            mb: 0.5,
                            fontSize: '0.8rem'
                          }}
                        >
                          {item.product.group_name}
                        </Typography>
                        
                        {/* Option Display/Edit */}
                        {needsOption(item.product.category) && (
                          <Box sx={{ mb: 1 }}>
                            {editingItem === index ? (
                              <FormControl size="small" sx={{ minWidth: 80 }}>
                                <InputLabel>選項</InputLabel>
                                <Select
                                  value={editingOption}
                                  label="選項"
                                  onChange={(e) => setEditingOption(e.target.value)}
                                >
                                  <MenuItem value="S">S</MenuItem>
                                  <MenuItem value="M">M</MenuItem>
                                  <MenuItem value="L">L</MenuItem>
                                </Select>
                              </FormControl>
                            ) : (
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                選項: {item.selectedOption || '未選擇'}
                              </Typography>
                            )}
                            <Button
                              size="small"
                              onClick={() => {
                                if (editingItem === index) {
                                  handleOptionChange(index, editingOption);
                                  setEditingItem(null);
                                } else {
                                  setEditingOption(item.selectedOption || '');
                                  setEditingItem(index);
                                }
                              }}
                              sx={{ ml: 1, fontSize: '0.7rem', minWidth: 'auto', px: 1 }}
                            >
                              {editingItem === index ? '確認' : '修改'}
                            </Button>
                          </Box>
                        )}

                        {/* Price and Actions */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'red' }}>
                            NT$ {(item.product.price_twd * item.quantity).toLocaleString()}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Quantity Controls */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                sx={{ width: 24, height: 24 }}
                              >
                                <RemoveIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <TextField
                                size="small"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 1;
                                  handleQuantityChange(index, value);
                                }}
                                sx={{ width: 40 }}
                                inputProps={{ 
                                  style: { 
                                    textAlign: 'center', 
                                    padding: '4px',
                                    fontSize: '0.8rem'
                                  } 
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                                sx={{ width: 24, height: 24 }}
                              >
                                <AddIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>

                            {/* Delete Button */}
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveItem(index)}
                              sx={{ width: 24, height: 24 }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Box>
        )}
      </Box>

      {/* Checkout Summary */}
      {cartItems.length > 0 && (
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'white', 
          borderTop: '1px solid #e0e0e0',
          flexShrink: 0,
        }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                已選商品總金額
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'red' }}>
                NT$ {calculateSelectedTotal().toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'right' }}>
              共{selectedCount}件商品 (購物車總共{cartItems.length}件商品)
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            onClick={onCheckout}
            disabled={selectedCount === 0}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 'bold',
              width: '100%',
              '&:hover': {
                backgroundColor: '#333',
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                color: '#666',
              },
            }}
          >
            送出訂單
          </Button>
          {selectedCount === 0 && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, textAlign: 'center' }}>
              請至少選擇一個商品
            </Typography>
          )}
        </Box>
      )}
      </Box>
    </>
  );
};

export default CartPage;
