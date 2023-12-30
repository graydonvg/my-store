'use client';

import SmallCartItemList from '@/components/cartItems/SmallCartItemList';
import Addresses from '@/components/accountPage/sections/Addresses';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { ExpandMore } from '@mui/icons-material';

export default function Shipping() {
  const { cartItems } = useAppSelector((state) => state.cart);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cardBackgroundColor = mode === 'dark' ? customColorPalette.grey.dark : 'white';
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        backgroundColor: cardBackgroundColor,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        borderRadius: '4px',
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography
          component="h2"
          fontSize={24}
          fontWeight={400}>
          Select your address
        </Typography>
        <Addresses />
      </Box>
      <Accordion
        disableGutters
        defaultExpanded={isBelowMedium ? false : true}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Typography
            component="h2"
            fontSize={24}
            fontWeight={400}>
            {`Your items (${cartItems.length})`}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SmallCartItemList />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
