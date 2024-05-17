import { Box, Typography } from '@mui/material';
import ToggleButtons from '@/components/ui/buttons/ToggleButtons';
import SelectField from '@/components/ui/inputFields/SelectField';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import NumberField from '@/components/ui/inputFields/NumberField';
import { HOME_PAGE_CATEGORIES, ORDERED_SIZES_FOR_TOGGLE_BUTTONS } from '@/data';
import { ChangeEvent, MouseEvent } from 'react';
import { setProductFormData } from '@/lib/redux/features/productForm/productFormSlice';
import { InsertProductStore } from '@/types';

type Props = {
  isSubmitting: boolean;
  isClearingAllFields: boolean;
  isOnSale: boolean;
};

export default function ProductFormFieldsAdminPanel({ isClearingAllFields, isSubmitting, isOnSale }: Props) {
  const dispatch = useAppDispatch();
  const { productFormData } = useAppSelector((state) => state.productForm);
  const isFieldDisabled = isSubmitting || isClearingAllFields;
  const categoryOptionsCapitalised = HOME_PAGE_CATEGORIES.map((category) =>
    category.label.replace(category.label.charAt(0), category.label.charAt(0).toUpperCase())
  );

  function handleSelectSize(_event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    dispatch(setProductFormData({ field: 'sizes', value: selectedSize }));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(setProductFormData({ field: name as keyof InsertProductStore, value }));
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography color={(theme) => theme.palette.custom.textField.label}>Available Sizes *</Typography>
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
        value={productFormData.category}
        options={categoryOptionsCapitalised}
        disabled={isFieldDisabled}
        required
        hasValue={productFormData.category.length > 0}
      />
      <CustomTextField
        label="Name"
        name="name"
        value={productFormData.name}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        required
        hasValue={productFormData.name.length > 0}
      />
      <CustomTextField
        label="Brand"
        name="brand"
        value={productFormData.brand}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        required
        hasValue={productFormData.brand.length > 0}
      />
      <CustomTextField
        label="Product details"
        name="details"
        value={productFormData.details}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        multiline
        placeholder="e.g. Black, Regular fit, ..."
        required
        hasValue={productFormData.details.length > 0}
      />
      <CustomTextField
        label="Delivery info"
        name="deliveryInfo"
        value={productFormData.deliveryInfo}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        multiline
        required
        hasValue={productFormData.deliveryInfo.length > 0}
      />
      <CustomTextField
        label="Return info"
        name="returnInfo"
        value={productFormData.returnInfo}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        multiline
        required
        hasValue={productFormData.returnInfo.length > 0}
      />
      <NumberField
        label="Price"
        name="price"
        value={productFormData.price}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        placeholder="e.g. 199"
        required
        hasValue={productFormData.price !== ''}
      />
      <SelectField
        label="On sale"
        name="isOnSale"
        value={productFormData.isOnSale}
        onChange={handleInputChange}
        options={['No', 'Yes']}
        disabled={isFieldDisabled}
        required
        hasValue={productFormData.isOnSale.length > 0}
      />
      <NumberField
        label="Sale %"
        name="salePercentage"
        onChange={handleInputChange}
        value={productFormData.salePercentage}
        disabled={!isOnSale || isFieldDisabled}
        placeholder="e.g. 20"
        required
        hasValue={productFormData.salePercentage !== ''}
      />
    </>
  );
}
