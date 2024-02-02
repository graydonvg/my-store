'use client';

import { Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import Link from 'next/link';

type Props = {
  name: string;
  brand: string;
  productId: string;
  category: string;
};

export default function LargeCartItemProductNameAndBrand({ name, brand, productId, category }: Props) {
  const colorPalette = useColorPalette();

  return (
    <>
      <Link href={`/products/${category.toLowerCase()}/${productId}`}>
        <Typography
          lineHeight={1}
          component="p"
          fontWeight={600}
          fontSize={{ xs: 20, sm: 24 }}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            paddingRight: 3,
          }}>
          {name}
        </Typography>
      </Link>
      <Typography
        lineHeight={1}
        component="span"
        fontWeight={600}
        fontSize={14}
        color={colorPalette.typographyVariants.grey}
        sx={{
          display: '-webkit-box',
          marginTop: '6px',
        }}>
        {brand}
      </Typography>
    </>
  );
}
