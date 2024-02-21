'use client';

import { ProductType } from '@/types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import ToggleButtons from '../../ui/buttons/ToggleButtons';
import ContainedButton from '../../ui/buttons/ContainedButton';
import { ExpandMore, Favorite, LocalShippingOutlined } from '@mui/icons-material';
import ProductImageBoxes from '../../ui/productImageBoxes/ProductImageBoxes';
import { MouseEvent, ReactNode, useState } from 'react';
import { toast } from 'react-toastify';
import useColorPalette from '@/hooks/useColorPalette';
import { ORDERED_SIZES_FOR_TOGGLE_BUTTONS } from '@/config';
import { formatCurrency } from '@/utils/formatCurrency';
import { calculateDiscountedProductPrice } from '@/utils/calculateDiscountedPrice';
import { BORDER_RADIUS } from '@/config';
import { sortItemSizesArrayForToggleButtons } from '@/utils/sortItemSizesArray';
import QuantityPickerProductDetails from './QuantityPickerProductDetails';
import AddToCartButton from '../../ui/buttons/AddToCartButton';
import { useAppSelector } from '@/lib/redux/hooks';
import SizePickerProductDetails from './SizePickerProductDetails';
import AddToWishlistButton from '../../ui/buttons/AddToWishlistButton';

type Props = {
  product: ProductType;
};

export default function ProductSelectionOptions({ product }: Props) {
  const size = useAppSelector((state) => state.productSelectionDetails.size);

  return (
    <>
      <SizePickerProductDetails product={product} />
      {size ? <QuantityPickerProductDetails /> : null}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          paddingY: 4,
        }}>
        <AddToCartButton product={product} />
        <AddToWishlistButton />
      </Box>
    </>
  );
}
