'use client';

import { Box, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { Product } from '@/types';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatCurrency';
import { calculateDiscountedProductPrice } from '@/utils/calculate';
import { BORDER_RADIUS } from '@/data';
import ProductCardSalePercentageBadge from './ProductCardSalePercentageBadge';
import ProductCardButtonsAdminPanel from './ProductCardButtonsAdminPanel';
import ProductCardImage from './ProductCardImage';
import MoveToCartButton from './MoveToCartButton';
import RemoveFromWishlistButton from './RemoveFromWishlistButton';
import { useState } from 'react';

type ProductCardProps = {
  product: Product;
  imageSizes: string;
  wishlistSize?: string;
  wishlistItemId?: string;
};

export default function ProductCard({ product, imageSizes, wishlistSize, wishlistItemId }: ProductCardProps) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');
  const isWishlistPath = pathname.startsWith('/wishlist');
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
            <ProductCardImage
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
                <ProductCardSalePercentageBadge percentage={product.salePercentage} />
              </Box>
            ) : null}

            {isWishlistPath ? (
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
                sx={{ color: (theme) => theme.palette.text.secondary }}>
                {product.brand?.toUpperCase()}
              </Typography>

              {isWishlistPath ? (
                <Box sx={{ display: 'flex', columnGap: 1, flexWrap: 'wrap' }}>
                  <Typography
                    component="span"
                    fontSize={14}
                    lineHeight={'18px'}
                    noWrap
                    sx={{ color: (theme) => theme.palette.text.secondary }}>
                    Size: {wishlistSize}
                  </Typography>

                  {!isInStock ? (
                    <Typography
                      component="span"
                      fontSize={14}
                      lineHeight={'18px'}
                      noWrap
                      sx={{
                        color: (theme) => theme.palette.secondary.main,
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
                  paddingRight: isWishlistPath ? 4 : 0,
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
                      color: (theme) => theme.palette.text.disabled,
                    }}>
                    {formatCurrency(product.price)}
                  </Typography>
                ) : null}
              </Box>

              {isWishlistPath && isInStock ? (
                <MoveToCartButton
                  product={product}
                  wishlistSize={wishlistSize ?? ''}
                  wishlistItemId={wishlistItemId ?? ''}
                />
              ) : null}
            </Box>
          </Box>
        </Link>

        {isAdminPath ? <ProductCardButtonsAdminPanel product={product} /> : null}
      </Box>
    </Box>
  );
}
