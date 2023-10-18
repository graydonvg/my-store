'use client';

import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import CustomButton from './ui/buttons/CustomButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { DeleteForever } from '@mui/icons-material';

type ProductCardProps = {};

export default function ProductCard() {
  const color = useCustomColorPalette();

  return (
    <Grid
      item
      xs={3}>
      <Paper
        elevation={0}
        sx={{ borderRadius: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              width: '300px',
            }}>
            <Image
              style={{ objectFit: 'cover', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}
              fill
              src={'https://www.apetogentleman.com/wp-content/uploads/2020/06/best-shirts-men.jpg'}
              alt="mens t-shirt"
              priority
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              alignSelf: 'flex-end',
              borderRadius: 1,
              marginTop: 1,
              marginRight: 1,
              paddingX: 1,
              paddingy: 0.5,
              backgroundColor: color.blue.dark,
            }}>
            <Typography
              component="span"
              variant="subtitle2"
              sx={{ color: color.grey.light, textTransform: 'uppercase' }}>
              sale
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingLeft: 2 }}>
            <Typography
              component="h3"
              variant="body1">
              T-Shirt
            </Typography>
            <Typography
              component="span"
              variant="h5">
              R189
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 1, paddingTop: 0 }}>
            <CustomButton
              fullWidth
              label="delete"
              startIcon={<DeleteForever />}
              styles={{
                backgroundColor: color.red.dark,
                '&:hover': {
                  backgroundColor: color.red.light,
                },
              }}
            />
            <CustomButton
              fullWidth
              label="update"
              styles={{
                backgroundColor: color.blue.dark,
                '&:hover': {
                  backgroundColor: color.blue.light,
                },
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}
