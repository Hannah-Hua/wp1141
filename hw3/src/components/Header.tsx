import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  FavoriteBorder as FavoriteIcon,
  NotificationsNone as NotificationIcon,
  ShoppingBagOutlined as CartIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

interface HeaderProps {
  onSearchChange: (searchTerm: string) => void;
  searchTerm: string;
  onFavoriteClick?: () => void;
  favoriteCount?: number;
  onCartClick?: () => void;
  cartCount?: number;
  onOrderHistoryClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange, searchTerm, onFavoriteClick, favoriteCount, onCartClick, cartCount, onOrderHistoryClick }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  // 當 searchTerm 從外部改變時，同步更新 inputValue
  React.useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    onSearchChange(inputValue.trim());
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setInputValue('');
    onSearchChange('');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ zIndex: 1000 }}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/logo.png" 
            alt="KMerch Logo" 
            style={{ height: '80px' }}
          />
        </Box>

        {/* Right Side Icons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Search Box */}
          <TextField
            placeholder="搜尋商品..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            size="small"
            sx={{
              width: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                backgroundColor: '#f5f5f5',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: '1px solid #1976d2',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    size="small"
                    onClick={handleSearch}
                    sx={{ color: '#666' }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: inputValue && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={clearSearch}
                    sx={{ color: '#666' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <IconButton 
            color="inherit" 
            sx={{ 
              color: 'black',
              position: 'relative'
            }}
            onClick={onFavoriteClick}
          >
            <FavoriteIcon />
            {favoriteCount !== undefined && favoriteCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  minWidth: 16,
                }}
              >
                {favoriteCount > 99 ? '99+' : favoriteCount}
              </Box>
            )}
          </IconButton>
              <IconButton 
                color="inherit" 
                sx={{ 
                  color: 'black',
                  position: 'relative'
                }}
                onClick={onCartClick}
              >
                <CartIcon />
                {cartCount !== undefined && cartCount > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'red',
                      color: 'white',
                      borderRadius: '50%',
                      width: 16,
                      height: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      minWidth: 16,
                    }}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </Box>
                )}
              </IconButton>
              
              <IconButton 
                color="inherit" 
                sx={{ 
                  color: 'black',
                  backgroundColor: '#f0f0f0',
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  }
                }}
                onClick={onOrderHistoryClick}
                title="查看訂單歷史"
              >
                <ReceiptIcon />
              </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
