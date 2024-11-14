import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

type Props = {
  isDeleting: boolean;
};

export default function AddNewProductButton({ isDeleting }: Props) {
  const router = useRouter();

  return (
    <ContainedButton
      label="add product"
      onClick={() => router.push('/admin/add-new-product')}
      disabled={isDeleting}
      startIcon={<Add />}
      color="primary"
      sxStyles={{ height: '32px', minHeight: '32px' }}
    />
  );
}
