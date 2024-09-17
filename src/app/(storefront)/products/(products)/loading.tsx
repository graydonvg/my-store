import { ProductsSkeleton } from '@/components/product/Products';
import PageHeaderSkeleton from '@/components/ui/PageHeaderSkeleton';

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <ProductsSkeleton />
    </>
  );
}
