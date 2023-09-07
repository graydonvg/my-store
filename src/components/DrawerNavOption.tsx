import Link from 'next/link';
import { ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function DrawerNavOption({ path, label }: { path: string; label: string }) {
  return (
    <>
      <Link
        tabIndex={-1}
        href={path}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary={label}
              sx={{ color: 'navDrawer.bodyText' }}
            />
            <ArrowForwardIosIcon />
          </ListItemButton>
        </ListItem>
      </Link>
      <Divider />
    </>
  );
}
