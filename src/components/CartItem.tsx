import { Box, IconButton, ListItem, Typography, useTheme } from '@mui/material';
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
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isOnSale = item?.product?.on_sale === 'Yes';
  const salePrice =
    item?.product?.price! - (item?.product?.price! as number) * ((item?.product?.sale_percentage! as number) / 100);

  return (
    <ListItem
      disableGutters
      disablePadding
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        opacity: cartItemToDelete.id === item?.cart_item_id ? '70%' : null,
        paddingY: 2,
      }}>
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          aspectRatio: 30 / 43,
          width: '60px',
          minWidth: '60px',
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
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexGrow: 1,
          height: 1,
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'grid',
            placeItems: 'center',
            width: '20px',
            height: '20px',
          }}>
          {cartItemToDelete.id === item?.cart_item_id ? (
            <Box sx={{ display: 'grid', placeItems: 'center', width: 1, height: 1 }}>
              <Spinner
                size={12}
                spinnerColor={mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.medium}
              />
            </Box>
          ) : (
            <IconButton
              disabled={cartItemToDelete.id === item?.cart_item_id}
              onClick={deleteCartItem}
              sx={{ padding: 0, width: 1, height: 1 }}>
              <Close
                fontSize="small"
                sx={{ opacity: '70%' }}
              />
            </IconButton>
          )}
        </Box>
        <Box
          component="header"
          sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            lineHeight={1}
            component="h4"
            fontWeight={600}
            fontSize={15}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              paddingRight: 3,
            }}>
            {item?.product?.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography
                lineHeight={1}
                component="span"
                sx={{ opacity: '70%' }}
                fontSize={13}>
                QTY:
              </Typography>
              <Typography
                lineHeight={1}
                component="span"
                fontWeight={600}
                fontSize={13}>
                {item?.quantity}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography
                lineHeight={1}
                component="span"
                sx={{ opacity: '70%' }}
                fontSize={13}>
                Size:
              </Typography>
              <Typography
                lineHeight={1}
                component="span"
                fontWeight={600}
                fontSize={13}>
                {item?.size}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          component="footer"
          sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: 1 }}>
          {isOnSale ? (
            <Box
              sx={{
                display: 'flex',
                borderRadius: 1,
                paddingX: 1,
                backgroundColor: customColorPalette.blue.dark,
                width: 'fit-content',
                height: 'fit-content',
              }}>
              <Typography
                lineHeight={1.6}
                component="span"
                sx={{
                  color: customColorPalette.grey.light,
                }}
                fontSize={14}>
                {`-${item?.product?.sale_percentage}%`}
              </Typography>
            </Box>
          ) : null}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              width: 1,
            }}>
            {isOnSale ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                }}>
                <Typography
                  lineHeight={1}
                  component="span"
                  sx={{ textDecoration: 'line-through', opacity: '70%' }}
                  fontSize={16}
                  fontWeight={700}>
                  {formatCurrency(item?.product?.price as number)}
                </Typography>
              </Box>
            ) : null}
            <Typography
              lineHeight={1}
              component="span"
              variant="h6"
              fontSize={16}
              fontWeight={700}>
              {formatCurrency(isOnSale ? salePrice : item?.product?.price!)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ListItem>
  );
}
