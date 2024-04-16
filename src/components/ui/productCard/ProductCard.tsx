'use client';

import { Box, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { ProductType } from '@/types';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatCurrency';
import { calculateDiscountedProductPrice } from '@/utils/calculateDiscountedPrice';
import { BORDER_RADIUS } from '@/config';
import SalePercentageBadgeProductCard from './SalePercentageBadgeProductCard';
import AdminButtonsProductCard from './AdminButtonsProductCard';
import ImageProductCard from './ImageProductCard';
import MoveToCartButton from '../buttons/MoveToCartButton';
import RemoveFromWishlistButton from '../buttons/RemoveFromWishlistButton';
import { useState } from 'react';

type ProductCardProps = {
  product: ProductType;
  imageSizes: string;
  wishlistSize?: string;
  wishlistItemId?: string;
};

export default function ProductCard({ product, imageSizes, wishlistSize, wishlistItemId }: ProductCardProps) {
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin');
  const isWishlistView = pathname.includes('/wishlist');
  const isOnSale = product.isOnSale === 'Yes';
  const discountedPrice = calculateDiscountedProductPrice(product);
  const imageUrl = product.productImageData?.find((image) => image.index === 0)?.imageUrl;
  const isInStock = product.sizes.includes(wishlistSize ?? '');
  const [isRemovingWishlistItem, setIsRemovingWishlistItem] = useState(false);

  return (
    <Box sx={{ borderRadius: BORDER_RADIUS, height: 1, opacity: isRemovingWishlistItem ? '50%' : null }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 1,
        }}>
        <Link href={`/products/${product.category?.toLowerCase()}/${product.productId}`}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}>
            <ImageProductCard
              productName={product.name}
              imageUrl={imageUrl!}
              imageSizes={imageSizes}
            />

            {isOnSale ? (
              <Box
                sx={{
                  position: 'absolute',
                  alignSelf: 'flex-start',
                }}>
                <SalePercentageBadgeProductCard percentage={product.salePercentage} />
              </Box>
            ) : null}

            {isWishlistView ? (
              <Box
                sx={{
                  position: 'absolute',
                  alignSelf: 'flex-end',
                  paddingTop: '5px',
                  paddingRight: '10px',
                }}>
                <RemoveFromWishlistButton
                  wishlistItemId={wishlistItemId ?? ''}
                  isRemovingWishlistItem={isRemovingWishlistItem}
                  setIsRemovingWishlistItem={setIsRemovingWishlistItem}
                />
              </Box>
            ) : null}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                paddingY: 1,
                position: 'relative',
              }}>
              <Typography
                component="h4"
                fontSize={16}
                fontWeight={600}
                lineHeight={'20px'}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                {product.name}
              </Typography>
              <Typography
                component="span"
                fontSize={14}
                lineHeight={'22px'}
                sx={{ color: (theme) => theme.palette.custom.typographyVariants.grey }}>
                {product.brand?.toUpperCase()}
              </Typography>

              {isWishlistView ? (
                <Box sx={{ display: 'flex', columnGap: 1, flexWrap: 'wrap' }}>
                  <Typography
                    component="span"
                    fontSize={14}
                    lineHeight={'18px'}
                    noWrap
                    sx={{ color: (theme) => theme.palette.custom.typographyVariants.grey }}>
                    Size: {wishlistSize}
                  </Typography>

                  {!isInStock ? (
                    <Typography
                      component="span"
                      fontSize={14}
                      lineHeight={'18px'}
                      noWrap
                      sx={{
                        color: (theme) =>
                          theme.palette.mode === 'dark'
                            ? theme.palette.custom.warning.light
                            : theme.palette.custom.warning.dark,
                      }}>
                      Out of stock
                    </Typography>
                  ) : null}
                </Box>
              ) : null}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  columnGap: 1,
                  paddingRight: isWishlistView ? 4 : 0,
                  overflow: 'hidden',
                  height: '24px',
                }}>
                <Typography
                  lineHeight={'24px'}
                  component="span"
                  fontFamily={'Georgia'}
                  fontStyle="italic"
                  fontSize={20}>
                  {formatCurrency(isOnSale ? discountedPrice : product.price)}
                </Typography>

                {isOnSale ? (
                  <Typography
                    lineHeight={1}
                    component="span"
                    fontSize={16}
                    fontFamily={'Georgia'}
                    fontStyle="italic"
                    sx={{
                      textDecoration: 'line-through',
                      color: (theme) => theme.palette.custom.typographyVariants.grey,
                    }}>
                    {formatCurrency(product.price)}
                  </Typography>
                ) : null}
              </Box>

              {isWishlistView && isInStock ? (
                <MoveToCartButton
                  product={product}
                  wishlistSize={wishlistSize ?? ''}
                  wishlistItemId={wishlistItemId ?? ''}
                />
              ) : null}
            </Box>
          </Box>
        </Link>

        {isAdminView ? <AdminButtonsProductCard product={product} /> : null}
      </Box>
    </Box>
  );
}
