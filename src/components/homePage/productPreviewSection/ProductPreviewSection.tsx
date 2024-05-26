import { Box } from '@mui/material';
import ProductPreviewList from './ProductPreviewList';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

type Props = {
  latestArrivals: Product[];
  productsOnSale: Product[];
  navigateToAllProducts: () => void;
};

export default function ProductPreviewSection({ latestArrivals, productsOnSale, navigateToAllProducts }: Props) {
  const router = useRouter();

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
      ].map((preview, index) =>
        preview.products.length > 0 ? (
          <ProductPreviewList
            key={index}
            title={preview.title}
            products={preview.products}
            onClick={preview.onClick}
          />
        ) : null
      )}
    </Box>
  );
}
