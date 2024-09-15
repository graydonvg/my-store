import { sortItemSizesArrayForStore } from '@/utils/sort';
import { RootState } from '../../store';
import { createSelector } from '@reduxjs/toolkit';
import { calculateRoundedDiscountedPrice } from '@/utils/calculate';

export function selectProductsData(state: RootState) {
  return state.products.data;
}

export const selectAvailableBrands = createSelector([selectProductsData], (productsData) => {
  const productBrands = productsData?.map((data) => data.brand);
  const brandSet = new Set(productBrands);
  return Array.from(brandSet);
});

export const selectAvailableSizes = createSelector([selectProductsData], (productsData) => {
  const productSizes = productsData?.map((data) => data.sizes).flat();
  const sizeSet = new Set(productSizes);
  return Array.from(sizeSet).sort(sortItemSizesArrayForStore);
});

export const selectPriceRange = createSelector([selectProductsData], (productsData) => {
  const productPrices = productsData?.map((data) =>
    data.isOnSale ? calculateRoundedDiscountedPrice(data.price, data.salePercentage) : data.price
  );
  const sortedPrices = productPrices?.sort((a, b) => a - b);
  const upperPriceRange = sortedPrices?.at(-1) ?? 0;
  const roundedUpperPriceRange = Math.ceil(upperPriceRange / 100) * 100;

  return [0, roundedUpperPriceRange];
});
