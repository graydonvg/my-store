import { Box, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import ToggleButtons from '@/components/ui/buttons/ToggleButtons';
import SelectField from '@/components/ui/inputFields/SelectField';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import NumberField from '@/components/ui/inputFields/NumberField';
import { ORDERED_SIZES_FOR_TOGGLE_BUTTONS } from '@/config';
import { ChangeEvent, MouseEvent } from 'react';
import { setProductFormData } from '@/lib/redux/slices/productFormSlice';
import { InsertProductTypeStore } from '@/types';

type Props = {
  isSubmitting: boolean;
  isClearingAllFields: boolean;
  isOnSale: boolean;
};

export default function ProductFormFields({ isClearingAllFields, isSubmitting, isOnSale }: Props) {
  const colorPalette = useColorPalette();
  const dispatch = useAppDispatch();
  const { productFormData } = useAppSelector((state) => state.productForm);
  const isFieldDisabled = isSubmitting || isClearingAllFields;

  function handleSelectSize(_event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    dispatch(setProductFormData({ field: 'sizes', value: selectedSize }));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(setProductFormData({ field: name as keyof InsertProductTypeStore, value }));
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography color={colorPalette.textField.label}>Available Sizes *</Typography>
        <ToggleButtons
          aria-label="select size"
          onChange={handleSelectSize}
          selection={productFormData.sizes}
          buttons={ORDERED_SIZES_FOR_TOGGLE_BUTTONS}
          disabled={isFieldDisabled}
        />
      </Box>
      <SelectField
        label="Category"
        name="category"
        onChange={handleInputChange}
        value={productFormData['category']}
        options={['Men', 'Women', 'Kids']}
        disabled={isFieldDisabled}
        required
      />
      <CustomTextField
        label="Name"
        name="name"
        value={productFormData['name']}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        required
      />
      <CustomTextField
        label="Brand"
        name="brand"
        value={productFormData['brand']}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        required
      />
      <CustomTextField
        label="Product details"
        name="details"
        value={productFormData['details']}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        multiline
        placeholder="e.g. Black, Regular fit, ..."
        required
      />
      <CustomTextField
        label="Delivery info"
        name="deliveryInfo"
        value={productFormData['deliveryInfo']}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        multiline
        required
      />
      <CustomTextField
        label="Return info"
        name="returnInfo"
        value={productFormData['returnInfo']}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        multiline
        required
      />
      <NumberField
        label="Price"
        name="price"
        value={productFormData['price']}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        placeholder="e.g. 199"
        required
      />
      <SelectField
        label="On sale"
        name="isOnSale"
        value={productFormData['isOnSale']}
        onChange={handleInputChange}
        options={['No', 'Yes']}
        disabled={isFieldDisabled}
        required
      />
      <NumberField
        label="Sale %"
        name="salePercentage"
        onChange={handleInputChange}
        value={productFormData['salePercentage']}
        disabled={!isOnSale || isFieldDisabled}
        placeholder="e.g. 20"
        required
      />
    </>
  );
}
