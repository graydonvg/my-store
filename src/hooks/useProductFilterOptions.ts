import { getProductsFilterOptions } from '@/services/products/get';
import { ProductsFilterCriteria } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

async function fetchProductFilterOptions({ category, onSale }: ProductsFilterCriteria) {
  return await getProductsFilterOptions({ category, onSale });
}

export function useProductFilterOptions({
  category,
  onSale,
  pathname,
}: ProductsFilterCriteria & {
  pathname: string;
}) {
  return useQuery({
    queryKey: ['productFilterOptions', { category, onSale, pathname }],
    queryFn: () => fetchProductFilterOptions({ category, onSale }),
    staleTime: 60000,
    placeholderData: keepPreviousData,
  });
}
