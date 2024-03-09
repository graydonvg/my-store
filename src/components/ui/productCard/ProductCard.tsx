'use client';

import { Box, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { usePathname } from 'next/navigation';
import { ProductType } from '@/types';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatCurrency';
import { calculateDiscountedProductPrice } from '@/utils/calculateDiscountedPrice';
import { BORDER_RADIUS } from '@/config';
import SalePercentageBadgeProductCard from './SalePercentageBadgeProductCard';
import AdminButtonsProductCard from './AdminButtonsProductCard';
import ImageProductCard from './ImageProductCard';

type ProductCardProps = {
  product: ProductType;
  imageSizes: string;
};

export default function ProductCard({ product, imageSizes }: ProductCardProps) {
  const colorPalette = useColorPalette();
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin');
  const isOnSale = product.isOnSale === 'Yes';
  const discountedPrice = calculateDiscountedProductPrice(product);
  const imageUrl = product.productImageData.find((image) => image.index === 0)?.imageUrl;

  return (
    <Box sx={{ borderRadius: BORDER_RADIUS, height: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 1,
        }}>
        <Link href={`/products/${product.category.toLowerCase()}/${product.productId}`}>
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
            <Box
              sx={{
                position: 'absolute',
                alignSelf: 'flex-start',
                display: 'flex',
                flexDirection: 'column',
              }}>
              {isOnSale ? <SalePercentageBadgeProductCard percentage={product.salePercentage} /> : null}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                paddingY: 1,
              }}>
              <Typography
                component="h4"
                fontSize={16}
                fontWeight={600}
                lineHeight={'20px'}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '1',
                  WebkitBoxOrient: 'vertical',
                }}>
                {product.name}
              </Typography>
              <Typography
                component="span"
                fontSize={14}
                lineHeight={'22px'}
                color={colorPalette.typographyVariants.grey}>
                {product.brand.toUpperCase()}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  columnGap: 1,
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
                    color={colorPalette.typographyVariants.grey}
                    sx={{ textDecoration: 'line-through' }}>
                    {formatCurrency(product.price)}
                  </Typography>
                ) : null}
              </Box>
            </Box>
          </Box>
        </Link>

        {isAdminView ? <AdminButtonsProductCard product={product} /> : null}
      </Box>
    </Box>
  );
}
