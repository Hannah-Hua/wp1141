import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { getEntertainments, getGroupsByEntertainment } from '../data/products';

interface SidebarProps {
  selectedEntertainment?: string;
  selectedGroup?: string;
  onEntertainmentSelect: (entertainment: string) => void;
  onGroupSelect: (group: string) => void;
  onClearFilters: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedEntertainment,
  selectedGroup,
  onEntertainmentSelect,
  onGroupSelect,
  onClearFilters,
}) => {
  const [entertainmentOpen, setEntertainmentOpen] = React.useState<{ [key: string]: boolean }>({});
  const [entertainments, setEntertainments] = useState<string[]>([]);
  const [groups, setGroups] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  // 載入側邊欄資料
  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        setIsLoading(true);
        const [entertainmentsData] = await Promise.all([
          getEntertainments()
        ]);
        
        setEntertainments(entertainmentsData);
        
        // 載入每個娛樂公司的團體
        const groupsData: { [key: string]: string[] } = {};
        for (const entertainment of entertainmentsData) {
          const groupsForEntertainment = await getGroupsByEntertainment(entertainment);
          groupsData[entertainment] = groupsForEntertainment;
        }
        setGroups(groupsData);
        
      } catch (error) {
        console.error('載入側邊欄資料失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSidebarData();
  }, []);

  const handleEntertainmentClick = (entertainment: string) => {
    setEntertainmentOpen(prev => ({
      ...prev,
      [entertainment]: !prev[entertainment]
    }));
  };

  const handleGroupClick = (group: string) => {
    onGroupSelect(group);
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
                  backgroundColor: !selectedEntertainment && !selectedGroup ? 'rgba(0,0,0,0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <ListItemText
                  primary="最熱門商品"
                  primaryTypographyProps={{
                    fontWeight: !selectedEntertainment && !selectedGroup ? 'bold' : 'normal',
                    textTransform: 'uppercase',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          {/* Artist Section */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              mb: 2,
              color: 'black',
            }}
          >
            ARTIST
          </Typography>

          <List sx={{ mb: 3 }}>
            {entertainments.map((entertainment) => {
              const entertainmentGroups = groups[entertainment] || [];
              const isOpen = entertainmentOpen[entertainment];

              return (
                <React.Fragment key={entertainment}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleEntertainmentClick(entertainment)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={entertainment}
                        primaryTypographyProps={{
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      />
                      {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {entertainmentGroups.map((group) => (
                        <ListItem key={group} disablePadding>
                          <ListItemButton
                            onClick={() => handleGroupClick(group)}
                            sx={{
                              pl: 4,
                              borderRadius: 1,
                              mb: 0.5,
                              backgroundColor: selectedGroup === group ? 'rgba(0,0,0,0.08)' : 'transparent',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.04)',
                              },
                            }}
                          >
                            <ListItemText
                              primary={group}
                              primaryTypographyProps={{
                                fontWeight: selectedGroup === group ? 'bold' : 'normal',
                                textTransform: 'uppercase',
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>

        </>
      )}
    </Box>
  );
};

export default Sidebar;
