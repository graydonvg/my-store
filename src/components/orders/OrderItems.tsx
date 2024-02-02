'use client';

import { Box, Divider, Grid, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { borderRadius } from '@/constants/styles';
import { formatCurrency } from '@/utils/formatCurrency';
import { OrderType } from '@/types';
import OrderDetails from './OrderDetails';
import Link from 'next/link';
import useColorPalette from '@/hooks/useColorPalette';
import { useState } from 'react';

type Props = {
  order: OrderType;
  borderColor: string;
};

export default function OrderItems({ borderColor, order }: Props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const isBelowLarge = useMediaQuery(theme.breakpoints.down('lg'));
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid
      item
      xs={12}
      md={9}>
      <OrderDetails
        borderColor={borderColor}
        order={order}
        show={isBelowMedium}
      />
      <Box
        sx={{
          border: `1px solid ${borderColor}`,
          borderTop: isBelowMedium ? 'none' : `1px solid ${borderColor}`,
          padding: 2,
          borderRadius: isBelowMedium ? 'none' : borderRadius,
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
        }}>
        <Grid
          container
          spacing={2}>
          {order.orderItems.map((item, index) => {
            const numberOfItems = order.orderItems.length;
            const isFirstItem = index === 0;
            const isSecondItem = index === 1;
            const isSecondLastItem = numberOfItems - 2 === index;
            const isLastItem = numberOfItems - 1 === index;
            const imageUrl = item.product?.productImageData.find((image) => image.index === 0)?.imageUrl;

            return (
              <Grid
                key={item.orderItemId}
                item
                xs={12}
                lg={6}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    paddingBottom: {
                      xs: numberOfItems > 1 && !isLastItem ? 2 : 0,
                      lg:
                        numberOfItems > 2 && !isLastItem && !isFirstItem && !isSecondItem && !isSecondLastItem ? 2 : 0,
                    },
                  }}>
                  <Grid
                    item
                    xs={4}
                    md={2}
                    lg={4}>
                    <Link href={`/products/${item.product?.category.toLowerCase()}/${item.product?.productId}`}>
                      <Box sx={{ position: 'relative', aspectRatio: 25 / 36 }}>
                        <Image
                          priority
                          style={{
                            objectFit: 'cover',
                            borderRadius: borderRadius,
                            cursor: 'pointer',
                            opacity: !isImageLoaded ? 0 : 100,
                          }}
                          fill
                          src={imageUrl!}
                          alt={`Image of ${item.product?.name}`}
                          sizes="(min-width: 1260px) 124px, (min-width: 900px) calc(10.88vw - 11px), calc(32.41vw - 30px)"
                          onLoad={() => setIsImageLoaded(true)}
                        />
                        {!isImageLoaded ? (
                          <Skeleton
                            height="100%"
                            width="100%"
                            variant="rectangular"
                          />
                        ) : null}
                      </Box>
                    </Link>
                  </Grid>
                  <Grid
                    item
                    xs={8}
                    md={10}
                    lg={8}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Link href={`/products/${item.product?.category.toLowerCase()}/${item.product?.productId}`}>
                        <Typography fontSize={18}>{item.product?.name}</Typography>
                      </Link>
                      <Box>
                        {[
                          { label: 'qty', value: item?.quantity },
                          { label: 'fontSize', value: item?.size },
                          { label: 'price paid', value: formatCurrency(item?.pricePaid) },
                        ].map((item) => (
                          <Box
                            key={item.label}
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              fontSize={13}
                              textTransform="uppercase"
                              fontWeight={500}
                              color={colorPalette.typographyVariants.grey}>
                              {item.label}:
                            </Typography>
                            <Typography fontSize={13}>{item.value}</Typography>
                          </Box>
                        ))}
                      </Box>
                      <Typography
                        fontSize={13}
                        textTransform="uppercase"
                        color={colorPalette.typographyVariants.grey}>
                        {item.product?.returnInfo}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                {isBelowLarge && !isLastItem ? <Divider /> : null}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Grid>
  );
}
