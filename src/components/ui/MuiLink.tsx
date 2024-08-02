'use client';

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
      sx={{
        cursor: 'pointer',
        color: (theme) => theme.palette.custom.text.link,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
      }}
      component="p"
      variant="body2">
      {children}
    </Link>
  );
}
