'use client';

import { Box } from '@mui/material';
import ProductPreviewList from './ProductPreviewList';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

type Props = {
  latestArrivals: Product[];
  productsOnSale: Product[];
};

export default function ProductPreviewSection({ latestArrivals, productsOnSale }: Props) {
  const router = useRouter();

  function navigateToAllProducts() {
    router.push('/products/all-products');
  }

  function navigateToSale() {
    router.push('/products/sale');
  }

  return (
    <Box
      component="section"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[
        { title: 'The Biggest Sale', products: productsOnSale, onClick: navigateToSale },
        { title: 'Latest Arrivals', products: latestArrivals, onClick: navigateToAllProducts },
      ].map((preview) =>
        preview.products.length > 0 ? (
          <ProductPreviewList
            key={preview.title}
            title={preview.title}
            products={preview.products}
            onClick={preview.onClick}
          />
        ) : null
      )}
    </Box>
  );
}
