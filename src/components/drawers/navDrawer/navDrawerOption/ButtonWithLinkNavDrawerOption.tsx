import Link from 'next/link';
import { ListItemButton, ListItemText } from '@mui/material';
import { useAppDispatch } from '@/lib/redux/hooks';
import { clearProductFormData } from '@/lib/redux/slices/productFormSlice';
import useColorPalette from '@/hooks/useColorPalette';
import { usePathname } from 'next/navigation';
import IconNavDrawerOption from './IconNavDrawerOption';
import { clearAllProductImagesData } from '@/lib/redux/slices/productImagesSlice';

type Props = {
  path: string;
  label: string;
};

export default function ButtonWithLinkNavDrawerOption({ path, label }: Props) {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
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
          sx={{
            color: isSaleOption ? colorPalette.warning.dark : colorPalette.navBar.lower.text,
            width: 1,
            textDecoration: pathname === path ? 'underline' : 'none',
            textDecorationColor: isSaleOption ? colorPalette.warning.light : colorPalette.navBar.lower.text,
            textDecorationThickness: 1,
            textUnderlineOffset: 6,
          }}
        />
        <IconNavDrawerOption label={label} />
      </ListItemButton>
    </Link>
  );
}
