import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

interface OrderData {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: string;
  items: any[];
  totalAmount: number;
  orderNumber: string;
  orderDate: string;
}

interface OrderHistoryProps {
  onClose: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ onClose }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);

  // 從 localStorage 載入訂單歷史
  useEffect(() => {
    const savedOrders = localStorage.getItem('kpop-merchandise-orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        // 按訂單日期排序（最新的在前）
        const sortedOrders = parsedOrders.sort((a: OrderData, b: OrderData) => 
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error('載入訂單歷史時發生錯誤:', error);
      }
    }
  }, []);

  // 格式化日期顯示
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ReceiptIcon sx={{ color: '#1976d2', fontSize: 40 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
            訂單歷史
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#666' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 訂單列表 */}
      {orders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <ReceiptIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              尚無訂單記錄
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              您還沒有下過任何訂單，快去選購您喜歡的商品吧！
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((order, index) => (
            <Accordion key={order.orderNumber} sx={{ boxShadow: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  }
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {order.orderNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {formatDisplayDate(order.orderDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {order.items.length} 件商品
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'red' }}>
                      NT$ {order.totalAmount.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              
              <AccordionDetails>
                <Grid container spacing={3}>
                  {/* 左側：訂單資訊 */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                          訂單資訊
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              訂單編號
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {order.orderNumber}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              訂單日期
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {order.orderDate}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              付款方式
                            </Typography>
                            <Chip 
                              label={order.paymentMethod} 
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
                            {order.customerName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {order.phone}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {order.email}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                            {order.address}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* 右側：商品明細 */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                          商品明細
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        {order.items.map((item: any, itemIndex: number) => (
                          <Box key={itemIndex} sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {item.product.product_name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              {item.product.group_name}
                              {item.selectedOption && ` - ${item.selectedOption}`}
                            </Typography>
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
                            NT$ {order.totalAmount.toLocaleString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default OrderHistory;
