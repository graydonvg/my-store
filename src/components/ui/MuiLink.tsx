import { Link } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  onClick?: () => void;
  children: ReactNode;
};

export default function MuiLink({ onClick, children }: Props) {
  return (
    <Link
      onClick={onClick}
      sx={{ cursor: 'pointer' }}
      component="p"
      variant="body2">
      {children}
    </Link>
  );
}
