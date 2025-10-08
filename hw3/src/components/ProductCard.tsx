import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating,
} from '@mui/material';
import { Product } from '../types';
import { getImageWithFallback, DEFAULT_GROUP_IMAGE } from '../utils/groupImages';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        maxWidth: 300,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid #f0f0f0',
      }}
    >
      <Box sx={{ position: 'relative', backgroundColor: '#f8f8f8' }}>
        <CardMedia
          component="img"
          image={getImageWithFallback(product.group_name)}
          alt={`${product.group_name} 團體合照`}
          sx={{
            height: 250,
            objectFit: 'cover',
            backgroundColor: '#f8f8f8',
          }}
          onError={(e) => {
            // 當圖片載入失敗時，使用預設圖片
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_GROUP_IMAGE;
          }}
        />
        {product.limited_edition && (
          <Chip
            label="限量版"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: '#f50057',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              borderRadius: '12px',
              zIndex: 2,
            }}
          />
        )}
        {product.preorder && (
          <Chip
            label="預購"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: '#1976d2',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              borderRadius: '12px',
              zIndex: 2,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography
          variant="body2"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            mb: 0.5,
            color: '#666',
          }}
        >
          {product.group_name}
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 'bold',
            fontSize: '1rem',
            mb: 1,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: '#000',
          }}
        >
          {product.product_name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating
            value={product.rating}
            readOnly
            size="small"
            precision={0.1}
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
            ({product.rating})
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontSize: '0.8rem',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: '#666',
            lineHeight: 1.4,
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#000',
              fontSize: '1.1rem',
              mb: 0.5,
            }}
          >
            NT$ {product.price_twd.toLocaleString()}
          </Typography>

          <Typography
            variant="body2"
            sx={{ fontSize: '0.8rem', color: '#666' }}
          >
            已售出 {product.sold_count.toLocaleString()} 件
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
