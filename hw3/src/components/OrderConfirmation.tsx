import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { CartItem } from '../types';

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

interface OrderConfirmationProps {
  orderData: OrderData;
  onClose: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderData, onClose }) => {
  // 格式化日期顯示
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // 計算預計送達日期（訂單日期 + 3天）
  const getExpectedDeliveryDate = (orderDate: string) => {
    try {
      const date = new Date(orderDate);
      date.setDate(date.getDate() + 3);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return '3天內';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 40 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
            訂單確認
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#666' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 成功訊息 */}
      <Card sx={{ mb: 4, backgroundColor: '#f8fff8', border: '1px solid #4caf50' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 30 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                訂單已成功送出！
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                我們會盡快與您聯繫確認訂單詳情，預計 {getExpectedDeliveryDate(orderData.orderDate)} 前送達。
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* 左側：訂單資訊 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                訂單資訊
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    訂單編號
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {orderData.orderNumber}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    訂單日期
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {formatDisplayDate(orderData.orderDate)}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    付款方式
                  </Typography>
                  <Chip 
                    label={orderData.paymentMethod} 
                    color="primary" 
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* 收貨資訊 */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                收貨資訊
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {orderData.customerName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {orderData.phone}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {orderData.email}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  {orderData.address}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 右側：商品明細 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                商品明細
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {orderData.items.map((item, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {item.product.product_name}
                  </Typography>
                  {item.selectedOption && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      選項: {item.selectedOption}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      數量: {item.quantity} × NT$ {item.product.price_twd.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'red' }}>
                      NT$ {(item.product.price_twd * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  總計
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'red' }}>
                  NT$ {orderData.totalAmount.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* 注意事項 */}
          <Card sx={{ backgroundColor: '#fff3e0' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#f57c00' }}>
                注意事項
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  • 我們會在 1-2 個工作天內與您聯繫確認訂單
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  • 如有任何問題，請聯繫客服專線
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  • 貨到付款，請準備好現金
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 返回首頁按鈕 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={onClose}
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
          返回首頁
        </Button>
      </Box>
    </Container>
  );
};

export default OrderConfirmation;
