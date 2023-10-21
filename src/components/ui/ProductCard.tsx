'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';
import Image from 'next/image';
import CustomButton from './buttons/CustomButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { DeleteForever } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import { green } from '@mui/material/colors';
import { ProductDataType } from '@/types';

export default function ProductCard({ product }: { product: ProductDataType }) {
  const color = useCustomColorPalette();
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const isOnSale = product.onSale == 'Yes';
  const salePrice = (product.price as number) * ((product.salePercentage as number) / 100);

  function formatCurrency(price: number) {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ZAR',
    });
    const formattedCurrency = currencyFormatter.format(price);
    return formattedCurrency.replace('ZAR', 'R');
  }

  return (
    <Grid
      item
      xs={6}
      md={4}
      lg={3}
      xl={2}>
      <Paper
        elevation={1}
        sx={{ borderRadius: 1, height: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1, sm: 2 },
            height: 1,
            paddingBottom: { xs: 1, sm: 2 },
          }}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              // maxHeight: '208px',
              aspectRatio: 1 / 1,
            }}>
            <Image
              style={{ objectFit: 'cover', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}
              fill
              sizes="(min-width: 1200px) 286px, (min-width: 900px) 33.21vw, calc(50vw - 20px)"
              src={product.imageData[0].imageUrl}
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
            {isOnSale ? (
              <Box
                sx={{
                  width: 'fit-content',
                  display: 'flex',
                  borderRadius: 1,
                  marginTop: 0.5,
                  marginRight: 0.5,
                  paddingX: 0.5,
                  backgroundColor: color.green.dark,
                }}>
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ color: color.grey.light, textTransform: 'uppercase' }}>
                  sale
                </Typography>
              </Box>
            ) : null}
            {/* <Box
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
            </Box> */}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              paddingX: { xs: 1, sm: 2 },
            }}>
            <Typography
              component="h3"
              variant="h6">
              {product.name}
            </Typography>
            {isOnSale ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                }}>
                <Typography
                  sx={{ paddingRight: 1 }}
                  component="span"
                  variant="h5">
                  {formatCurrency(salePrice)}
                </Typography>
                <Typography
                  component="span"
                  variant="body1"
                  sx={{ textDecoration: 'line-through', opacity: '70%' }}>
                  {formatCurrency(product.price as number)}
                </Typography>
              </Box>
            ) : (
              <Typography
                component="span"
                variant="h5">
                {formatCurrency(product.price as number)}
              </Typography>
            )}
          </Box>
          {isAdminView ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                flexGrow: 1,
                gap: { xs: 1, sm: 2 },
                paddingTop: 1,
                paddingX: { xs: 1, sm: 2 },
              }}>
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
          ) : null}
        </Box>
      </Paper>
    </Grid>
  );
}
