import { Box, Typography } from '@mui/material';
import ToggleButtons from '@/components/ui/buttons/ToggleButtons';
import CustomTextField from '@/components/ui/CustomTextField';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ChangeEvent, MouseEvent } from 'react';
import { setProductFormData } from '@/lib/redux/features/productForm/productFormSlice';
import { ProductForm } from '@/types';
import { selectProductFormData } from '@/lib/redux/features/productForm/productFormSelectors';
import { HOME_PAGE_SHOP_BY_CATEGORY, ORDERED_SIZES_FOR_TOGGLE_BUTTONS } from '@/constants';

type Props = {
  isSubmitting: boolean;
  isClearingAllFields: boolean;
};

export default function ProductFormFieldsAdminPanel({ isClearingAllFields, isSubmitting }: Props) {
  const dispatch = useAppDispatch();
  const productFormData = useAppSelector(selectProductFormData);
  const isFieldDisabled = isSubmitting || isClearingAllFields;
  const categoryOptionsCapitalised = HOME_PAGE_SHOP_BY_CATEGORY.map((category) =>
    category.label.replace(category.label.charAt(0), category.label.charAt(0).toUpperCase())
  );

  function handleSelectSize(_event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    dispatch(setProductFormData({ field: 'sizes', value: selectedSize }));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    dispatch(setProductFormData({ field: name as keyof ProductForm, value }));
  }

  function getOnSaleSelectFieldValue(isOnSale: boolean | '') {
    if (isOnSale) {
      return 'Yes';
    }

    if (!isOnSale && isOnSale !== '') {
      return 'No';
    }

    return '';
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography sx={{ color: (theme) => theme.palette.custom.textField.label }}>Available Sizes *</Typography>
        <ToggleButtons
          aria-label="select available sizes"
          onChange={handleSelectSize}
          selection={productFormData.sizes}
          buttons={ORDERED_SIZES_FOR_TOGGLE_BUTTONS}
          disabled={isFieldDisabled}
        />
      </Box>
      <CustomTextField
        select
        label="Category"
        name="category"
        onChange={handleInputChange}
        value={productFormData.category}
        selectOptions={categoryOptionsCapitalised}
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
        placeholder="e.g. Blue & White Striped, 100% Cotton, Sleeveless, ..."
        required
        hasValue={productFormData.details.length > 0}
      />
      <CustomTextField
        label="Filter colors"
        name="filterColors"
        value={productFormData.filterColors.length ? productFormData.filterColors.join(', ') : ''}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        multiline
        placeholder="e.g. blue, white, multi, ..."
        required
        hasValue={productFormData.filterColors.length > 0}
      />
      <CustomTextField
        label="Filter materials"
        name="filterMaterials"
        value={productFormData.filterMaterials.length ? productFormData.filterMaterials.join(', ') : ''}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        multiline
        placeholder="e.g. cotton blend, wool blend, ..."
        required
        hasValue={productFormData.filterMaterials.length > 0}
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
      <CustomTextField
        type="number"
        label="Price"
        name="price"
        value={productFormData.price}
        onChange={handleInputChange}
        disabled={isFieldDisabled}
        placeholder="e.g. 199"
        required
        hasValue={productFormData.price !== ''}
      />
      <CustomTextField
        select
        label="On sale"
        name="isOnSale"
        value={getOnSaleSelectFieldValue(productFormData.isOnSale)}
        onChange={handleInputChange}
        selectOptions={['No', 'Yes']}
        disabled={isFieldDisabled}
        required
        hasValue={productFormData.isOnSale !== ''}
      />
      <CustomTextField
        type="number"
        label="Sale %"
        name="salePercentage"
        onChange={handleInputChange}
        value={productFormData.salePercentage}
        disabled={!productFormData.isOnSale || isFieldDisabled}
        placeholder="e.g. 20"
        required
        hasValue={productFormData.salePercentage !== ''}
      />
    </>
  );
}
