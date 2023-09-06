import Link from 'next/link';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Divider } from '@mui/material';

export default function DrawerNavOption({ path, label }: { path: string; label: string }) {
  return (
    <Link
      tabIndex={-1}
      href={path}>
      <Button
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: 1,
          margin: 0,
          color: 'navDrawer.contentText',
        }}>
        {label}
        <ArrowForwardIosIcon />
      </Button>
      <Divider />
    </Link>
  );
}
