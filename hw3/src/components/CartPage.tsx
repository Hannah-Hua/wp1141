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

interface CartPageProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCloseCart: () => void;
  onCheckout?: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, setCartItems, onCloseCart, onCheckout }) => {
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editingOption, setEditingOption] = useState<string>('');

  // 更新商品數量
  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
          購物車 ({cartItems.length} 件商品)
        </Typography>
        <Button
          startIcon={<CloseIcon />}
          onClick={onCloseCart}
          sx={{
            color: '#666',
            '&:hover': {
              backgroundColor: '#ffebee',
              color: '#ff1744',
            },
          }}
        >
          關閉
        </Button>
      </Box>

      {/* Cart Items */}
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
        <Box sx={{ mb: 4 }}>
          {/* Select All */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Checkbox
              checked={cartItems.length > 0 && cartItems.every(item => item.isSelected)}
              indeterminate={selectedCount > 0 && selectedCount < cartItems.length}
              onChange={handleSelectAll}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              全選 ({selectedCount}/{cartItems.length})
            </Typography>
          </Box>

          {/* Items List */}
          {cartItems.map((item, index) => (
            <Card key={`${item.product.product_id}-${item.selectedOption || 'default'}`} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  {/* Checkbox */}
                  <Grid item xs={1}>
                    <Checkbox
                      checked={item.isSelected}
                      onChange={() => handleToggleSelect(index)}
                    />
                  </Grid>

                  {/* Product Image */}
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 100,
                        backgroundColor: '#f8f8f8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {item.product.product_name}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Product Info */}
                  <Grid item xs={4}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {item.product.product_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {item.product.group_name}
                    </Typography>
                    
                    {/* Option Display/Edit */}
                    {needsOption(item.product.category) && (
                      <Box sx={{ mb: 1 }}>
                        {editingItem === index ? (
                          <FormControl size="small" sx={{ minWidth: 120 }}>
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
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
                          sx={{ ml: 1, fontSize: '0.75rem' }}
                        >
                          {editingItem === index ? '確認' : '修改選項'}
                        </Button>
                      </Box>
                    )}
                  </Grid>

                  {/* Quantity */}
                  <Grid item xs={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          handleQuantityChange(index, value);
                        }}
                        sx={{ width: 60 }}
                        inputProps={{ style: { textAlign: 'center' } }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(index, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  {/* Price */}
                  <Grid item xs={2}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      NT$ {(item.product.price_twd * item.quantity).toLocaleString()}
                    </Typography>
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={1}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color="error"
                        onClick={() => handleRemoveItem(index)}
                      >
                        DELETE
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Checkout Summary */}
      {cartItems.length > 0 && (
        <Box sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                實付總額
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  已選商品總金額
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'red' }}>
                  NT$ {calculateSelectedTotal().toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  共{selectedCount}件商品
                </Typography>
                {selectedCount > 0 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    (購物車總共{cartItems.length}件商品)
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={onCheckout}
              disabled={selectedCount === 0}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
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
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                請至少選擇一個商品
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
