import { Box } from '@mui/material';
import ProductPreviewList from './ProductPreviewList';
import { useRouter } from 'next/navigation';
import { ProductType } from '@/types';

type Props = {
  latestArrivals: ProductType[] | undefined;
  productsOnSale: ProductType[] | undefined;
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
        preview.products ? (
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
