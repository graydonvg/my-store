import { Box, IconButton, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { Spinner } from './ui/progress/Spinner';
import { Close } from '@mui/icons-material';
import { CartItemType } from '@/types';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { formatCurrency } from '@/lib/utils';

type Props = {
  cartItemToDelete: { id: string };
  item: CartItemType;
  deleteCartItem: () => void;
};

export default function CartItem({ item, cartItemToDelete, deleteCartItem }: Props) {
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isOnSale = item?.product?.on_sale === 'Yes';
  const salePrice =
    item?.product?.price! - (item?.product?.price! as number) * ((item?.product?.sale_percentage! as number) / 100);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: { xs: 1, sm: 2 },
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        opacity: cartItemToDelete.id === item?.cart_item_id ? '70%' : null,
      }}>
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          aspectRatio: 3 / 4,
          flexGrow: 1,
          maxWidth: '100px',
          minWidth: '100px',
        }}>
        <Image
          style={{ objectFit: 'cover', borderRadius: '4px' }}
          fill
          sizes="(min-width: 600px) 110px, calc(25.36vw - 9px)"
          src={item?.product?.product_image_data[0].image_url ?? ''}
          alt={`Image of ${item?.product?.name}`}
          priority
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          flexGrow: 1,
          gap: 1,
        }}>
        <Typography
          lineHeight={{ xs: 1, sm: 1.6 }}
          component="h4"
          variant="h6">
          {item?.product?.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography
              lineHeight={{ xs: 1, sm: 1.6 }}
              component="span"
              variant="body1"
              sx={{ opacity: '80%' }}>
              QTY:
            </Typography>
            <Typography
              lineHeight={{ xs: 1, sm: 1.6 }}
              component="span"
              variant="body1"
              fontWeight={500}>
              {item?.quantity}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography
              lineHeight={{ xs: 1, sm: 1.6 }}
              component="span"
              variant="body1"
              sx={{ opacity: '80%' }}>
              Size:
            </Typography>
            <Typography
              lineHeight={{ xs: 1, sm: 1.6 }}
              component="span"
              variant="body1"
              fontWeight={500}>
              {item?.size}
            </Typography>
          </Box>
        </Box>
        {/* <Typography
          component="span"
          variant="h6"
          fontWeight={700}
          sx={{ justifySelfSelf: 'flex-end' }}>
          R{item?.product?.price! - item?.product?.price! * (item?.product?.sale_percentage! / 100)}
        </Typography> */}
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', paddingTop: 1 }}>
          <Typography
            lineHeight={1}
            component="span"
            variant="h6"
            fontWeight={700}>
            {formatCurrency(isOnSale ? salePrice : item?.product?.price!)}
          </Typography>
          {isOnSale ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                // flexWrap: 'nowrap',
                gap: 1,
              }}>
              <Typography
                lineHeight={1}
                component="span"
                variant="h6"
                sx={{ textDecoration: 'line-through', opacity: '50%' }}
                fontWeight={400}>
                {formatCurrency(item?.product?.price as number)}
              </Typography>
              <Typography
                lineHeight={1}
                component="span"
                variant="h6"
                sx={{ color: color.blue.light, fontFamily: 'serif' }}>
                {`-${item?.product?.sale_percentage}%`}
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>
      <IconButton
        disabled={cartItemToDelete.id === item?.cart_item_id}
        onClick={deleteCartItem}
        sx={{ padding: 0 }}>
        {cartItemToDelete.id === item?.cart_item_id ? (
          <Spinner
            size={20}
            spinnerColor={mode === 'dark' ? color.grey.light : color.grey.dark}
          />
        ) : (
          <Close sx={{ color: mode === 'dark' ? color.grey.light : color.grey.dark }} />
        )}
      </IconButton>
    </Box>
  );
}
