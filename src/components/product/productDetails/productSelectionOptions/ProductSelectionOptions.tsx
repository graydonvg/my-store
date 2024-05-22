'use client';

import { Product } from '@/types';
import { Box } from '@mui/material';
import ProductDetailsQuantityPicker from './ProductDetailsQuantityPicker';
import AddToCartButton from './AddToCartButton';
import ProductDetailsSizePicker from './ProductDetailsSizePicker';
import AddToWishlistButton from './AddToWishlistButton';
import { useState } from 'react';

type Props = {
  product: Product;
};

export default function ProductSelectionOptions({ product }: Props) {
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <ProductDetailsSizePicker
        product={product}
        size={size}
        setSize={setSize}
      />
      {size ? (
        <ProductDetailsQuantityPicker
          quantity={quantity}
          setQuantity={setQuantity}
        />
      ) : null}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          paddingY: 4,
        }}>
        <AddToCartButton
          product={product}
          size={size}
          quantity={quantity}
          setSize={setSize}
          setQuantity={setQuantity}
        />
        <AddToWishlistButton
          product={product}
          size={size}
          setSize={setSize}
          setQuantity={setQuantity}
        />
      </Box>
    </>
  );
}
