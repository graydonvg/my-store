import { Product } from '@/types';
import { Box, Typography } from '@mui/material';
import ToggleButtons from '../../../ui/buttons/ToggleButtons';
import { Dispatch, MouseEvent, SetStateAction } from 'react';
import { CONSTANTS } from '@/constants';
import { sortItemSizesArrayForToggleButtons } from '@/utils/sortingHelpers';

type Props = {
  product: Product;
  size: string | null;
  setSize: Dispatch<SetStateAction<string | null>>;
};

export default function ProductDetailsSizePicker({ product, size, setSize }: Props) {
  function getItemSizeToggleButtonOptions() {
    const availableSizes = product.sizes
      .map((size) => CONSTANTS.ORDERED_SIZES_FOR_TOGGLE_BUTTONS.filter((option) => option.value === size)[0])
      .sort(sortItemSizesArrayForToggleButtons);

    return availableSizes;
  }

  function handleSelectSize(_event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    setSize((prev) => (prev !== selectedSize ? selectedSize : null));
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
