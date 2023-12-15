import { Container } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function CommonNavbarContainer({ children }: Props) {
  return <Container maxWidth="lg">{children}</Container>;
}
