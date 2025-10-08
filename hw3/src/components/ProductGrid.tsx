import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  Button,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
} from '@mui/icons-material';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  title?: string;
  onProductClick?: (product: Product) => void;
  onCloseFavorites?: () => void;
  showCloseButton?: boolean;
  hideEmptyMessage?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title, onProductClick, onCloseFavorites, showCloseButton, hideEmptyMessage }) => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Title */}
      {title && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: 'black',
              }}
            >
              {title}
            </Typography>
            {showCloseButton && (
              <Button
                startIcon={<CloseIcon />}
                onClick={onCloseFavorites}
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
            )}
          </Box>
        </Box>
      )}

      {/* Products Grid */}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
            <ProductCard product={product} onClick={onProductClick} />
          </Grid>
        ))}
      </Grid>

      {products.length === 0 && !hideEmptyMessage && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            沒有找到符合條件的商品
          </Typography>
          <Typography variant="body2">
            請嘗試調整篩選條件
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ProductGrid;
