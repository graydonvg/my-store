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
          <ListItemButton disableGutters>
            <ListItemText
              primary={label}
              sx={{ color: 'navDrawer.bodyText', marginLeft: 1 }}
            />
            <ArrowForwardIosIcon sx={{ marginRight: 2 }} />
          </ListItemButton>
        </ListItem>
      </Link>
      <Divider />
    </>
  );
}
