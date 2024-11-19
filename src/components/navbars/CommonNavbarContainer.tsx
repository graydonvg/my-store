import { Container } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function CommonNavbarContainer({ children }: Props) {
  return <Container sx={{ maxWidth: '1248px !important' }}>{children}</Container>;
}
