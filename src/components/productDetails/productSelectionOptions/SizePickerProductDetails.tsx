import { ProductType } from '@/types';
import { Box, Typography } from '@mui/material';
import ToggleButtons from '../../ui/buttons/ToggleButtons';
import { MouseEvent } from 'react';
import { ORDERED_SIZES_FOR_TOGGLE_BUTTONS } from '@/config';
import { sortItemSizesArrayForToggleButtons } from '@/utils/sortItemSizesArray';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setSize } from '@/lib/redux/slices/productSelectionDetailsSlice';

type Props = {
  product: ProductType;
};

export default function SizePickerProductDetails({ product }: Props) {
  const dispatch = useAppDispatch();
  const size = useAppSelector((state) => state.productSelectionDetails.size);

  function getItemSizeToggleButtonOptions() {
    const availableSizes = product.sizes
      .map((size) => ORDERED_SIZES_FOR_TOGGLE_BUTTONS.filter((option) => option.value === size)[0])
      .sort(sortItemSizesArrayForToggleButtons);

    return availableSizes;
  }

  function handleSelectSize(_event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    dispatch(setSize(selectedSize));
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        paddingBottom: 2,
      }}>
      <Typography
        component="h3"
        fontWeight={600}
        fontSize={14}
        sx={{ textTransform: 'uppercase' }}>
        Select A Size
      </Typography>
      <ToggleButtons
        onChange={handleSelectSize}
        buttons={getItemSizeToggleButtonOptions()}
        selection={size ? [size] : []}
      />
    </Box>
  );
}
