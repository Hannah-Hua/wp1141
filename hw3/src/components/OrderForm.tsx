import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { CartItem } from '../types';

interface OrderFormProps {
  cartItems: CartItem[];
  totalAmount: number;
  onBack: () => void;
  onSubmitOrder?: (orderData: OrderData) => void;
}

interface OrderData {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  totalAmount: number;
  orderNumber: string;
  orderDate: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ 
  cartItems, 
  totalAmount, 
  onBack, 
  onSubmitOrder 
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
  });

  // 處理表單輸入變化
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除對應的錯誤訊息
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 表單驗證
  const validateForm = () => {
    const newErrors = {
      customerName: '',
      phone: '',
      email: '',
      address: '',
    };

    if (!formData.customerName.trim()) {
      newErrors.customerName = '請輸入姓名';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '請輸入手機號碼';
    } else if (!/^09\d{8}$/.test(formData.phone)) {
      newErrors.phone = '請輸入正確的手機號碼格式 (09xxxxxxxx)';
    }

    if (!formData.email.trim()) {
      newErrors.email = '請輸入 Email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '請輸入正確的 Email 格式';
    }

    if (!formData.address.trim()) {
      newErrors.address = '請輸入詳細地址';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // 生成訂單編號
  const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${year}${month}${day}${random}`;
  };

  // 格式化訂單日期 - 使用 ISO 格式以便正確排序
  const formatOrderDate = () => {
    const now = new Date();
    return now.toISOString(); // 使用 ISO 格式: "2025-01-07T10:30:00.000Z"
  };

  // 處理訂單提交
  const handleSubmit = () => {
    if (validateForm()) {
      const orderData: OrderData = {
        ...formData,
        paymentMethod: '貨到付款',
        items: cartItems.filter(item => item.isSelected),
        totalAmount,
        orderNumber: generateOrderNumber(),
        orderDate: formatOrderDate(),
      };
      
      console.log('訂單資料:', orderData);
      onSubmitOrder?.(orderData);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onBack} sx={{ color: '#666' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
            填寫訂單資料
          </Typography>
        </Box>
        <IconButton onClick={onBack} sx={{ color: '#666' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        {/* 左側：訂單資訊 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                訂單摘要
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {cartItems.filter(item => item.isSelected).map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {item.product.product_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.product.group_name}
                    {item.selectedOption && ` - ${item.selectedOption}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    數量: {item.quantity} × NT$ {item.product.price_twd.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'red' }}>
                    NT$ {(item.product.price_twd * item.quantity).toLocaleString()}
                  </Typography>
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  總計
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'red' }}>
                  NT$ {totalAmount.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* 付款方式 */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                付款方式
              </Typography>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  貨到付款
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  (商品送達時付款)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 右側：個人資料表單 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                個人基本資料
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* 姓名 */}
                <TextField
                  label="姓名"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  error={!!errors.customerName}
                  helperText={errors.customerName}
                  fullWidth
                  required
                />

                {/* 電話 */}
                <TextField
                  label="手機號碼"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  fullWidth
                  required
                  placeholder="09xxxxxxxx"
                />

                {/* Email */}
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  required
                />

                {/* 地址 */}
                <TextField
                  label="詳細地址"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  error={!!errors.address}
                  helperText={errors.address}
                  fullWidth
                  multiline
                  rows={3}
                  required
                  placeholder="請輸入完整的收貨地址，包含縣市、區、街道、門牌號碼等"
                />
              </Box>

              {/* 提交按鈕 */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
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
                  }}
                >
                  確認送出訂單
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderForm;
