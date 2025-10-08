import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { getEntertainments } from '../data/products';

interface SidebarProps {
  selectedEntertainment?: string;
  onEntertainmentSelect: (entertainment: string) => void;
  onClearFilters: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedEntertainment,
  onEntertainmentSelect,
  onClearFilters,
}) => {
  const [entertainments, setEntertainments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 載入側邊欄資料
  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        setIsLoading(true);
        const entertainmentsData = await getEntertainments();
        setEntertainments(entertainmentsData);
      } catch (error) {
        console.error('載入側邊欄資料失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSidebarData();
  }, []);

  const handleEntertainmentClick = (entertainment: string) => {
    onEntertainmentSelect(entertainment);
  };


  return (
    <Box
      sx={{
        width: 250,
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        borderRight: '1px solid #e0e0e0',
        p: 2,
      }}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          {/* Popular Products */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              mb: 2,
              color: 'black',
            }}
          >
            熱門商品
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={onClearFilters}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: !selectedEntertainment ? 'rgba(0,0,0,0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <ListItemText
                  primary="最熱門商品"
                  primaryTypographyProps={{
                    fontWeight: !selectedEntertainment ? 'bold' : 'normal',
                    textTransform: 'uppercase',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          {/* Entertainment Section */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              mb: 2,
              color: 'black',
            }}
          >
            ENTERTAINMENT
          </Typography>

          <List sx={{ mb: 3 }}>
            {entertainments.map((entertainment) => (
              <ListItem key={entertainment} disablePadding>
                <ListItemButton
                  onClick={() => handleEntertainmentClick(entertainment)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    backgroundColor: selectedEntertainment === entertainment ? 'rgba(0,0,0,0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemText
                    primary={entertainment}
                    primaryTypographyProps={{
                      fontWeight: selectedEntertainment === entertainment ? 'bold' : 'normal',
                      textTransform: 'uppercase',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

        </>
      )}
    </Box>
  );
};

export default Sidebar;
