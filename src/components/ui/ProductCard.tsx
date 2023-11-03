'use client';

import { Box, Paper, Typography } from '@mui/material';
import Image from 'next/image';
import CustomButton from './buttons/CustomButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { DeleteForever } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { ProductType } from '@/types';
import Link from 'next/link';

type Props = {
  product: ProductType;
};

export default function ProductCard({ product }: Props) {
  const color = useCustomColorPalette();
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const isOnSale = product.on_sale == 'Yes';
  const salePrice = product.price - (product.price as number) * ((product.sale_percentage as number) / 100);

  return (
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
            src={product.product_image_data[0].image_url}
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
                {formatCurrency(product.price)}
              </Typography>
            </Box>
          ) : (
            <Typography
              component="span"
              variant="h5">
              {formatCurrency(product.price)}
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
              backgroundColor="red"
            />
            <CustomButton
              fullWidth
              label="update"
              backgroundColor="blue"
            />
          </Box>
        ) : null}
      </Box>
    </Paper>
  );
}
