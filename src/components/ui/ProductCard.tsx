'use client';

import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import CustomButton from './buttons/CustomButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { DeleteForever } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import { green, orange } from '@mui/material/colors';

type ProductCardProps = {};

export default function ProductCard() {
  const color = useCustomColorPalette();
  const pathname = usePathname();

  const isAdminView = pathname.includes('admin-view');

  return (
    <Grid
      item
      xs={6}
      md={4}
      lg={3}>
      <Paper
        elevation={1}
        sx={{ borderRadius: 1, width: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 2 } }}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              aspectRatio: 1 / 1,
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}>
            <Box
              sx={{
                width: 'fit-content',
                display: 'flex',
                borderRadius: 1,
                marginTop: 0.5,
                marginRight: 0.5,
                paddingX: 0.5,
                backgroundColor: green[700],
              }}>
              <Typography
                component="span"
                variant="caption"
                sx={{ color: color.grey.light, textTransform: 'uppercase' }}>
                sale
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                borderRadius: 1,
                marginTop: 0.5,
                marginRight: 0.5,
                paddingX: 0.5,
                backgroundColor: orange[700],
              }}>
              <Typography
                component="span"
                variant="caption"
                sx={{ color: color.grey.light, textTransform: 'uppercase' }}>
                low stock
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0, sm: 1 }, paddingLeft: 2 }}>
            <Typography
              component="h3"
              variant="body1">
              T-Shirt
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
              }}>
              <Typography
                component="span"
                variant="h5">
                R160
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ textDecoration: 'line-through', opacity: '70%' }}>
                R189
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 1, sm: 2 },
              paddingX: { xs: 1, sm: 2 },
            }}>
            {isAdminView ? (
              <>
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
              </>
            ) : null}
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}
