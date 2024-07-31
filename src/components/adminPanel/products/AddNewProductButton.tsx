import ContainedButton from '@/components/ui/buttons/simple/ContainedButton';
import { Add } from '@mui/icons-material';
import Link from 'next/link';

export default function AddNewProductButton() {
  return (
    <Link href="/admin/add-new-product">
      <ContainedButton
        label="add product"
        startIcon={<Add />}
        color="primary"
        sxStyles={{ height: '32px', minHeight: '32px' }}
      />
    </Link>
  );
}
