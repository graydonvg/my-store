import Link from 'next/link';
import { ListItemButton, ListItemText } from '@mui/material';
import { useAppDispatch } from '@/lib/redux/hooks';
import { clearProductFormData } from '@/lib/redux/features/productForm/productFormSlice';
import { usePathname } from 'next/navigation';
import IconNavDrawerOption from './IconNavDrawerOption';
import { clearAllProductImagesData } from '@/lib/redux/features/productImages/productImagesSlice';

type Props = {
  path: string;
  label: string;
};

export default function ButtonWithLinkNavDrawerOption({ path, label }: Props) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isSaleOption = label.toLowerCase() === 'sale';

  function clearAddNewProductFormData() {
    if (path === '/admin/add-new-product') {
      dispatch(clearProductFormData());
      dispatch(clearAllProductImagesData());
    }
  }

  return (
    <Link
      style={{ height: '100%', width: '100%' }}
      onClick={clearAddNewProductFormData}
      tabIndex={-1}
      href={path}>
      <ListItemButton sx={{ height: '100%' }}>
        <ListItemText
          primary={label}
          sx={(theme) => ({
            color: isSaleOption ? theme.palette.secondary.main : theme.palette.custom.navbar.lower.text,
            width: 1,
            textDecoration: pathname === path ? 'underline' : 'none',
            textDecorationColor: isSaleOption ? theme.palette.secondary.main : theme.palette.custom.navbar.lower.text,
            textDecorationThickness: 1,
            textUnderlineOffset: 6,
          })}
        />
        <IconNavDrawerOption label={label} />
      </ListItemButton>
    </Link>
  );
}
