'use client';
import { FC } from 'react';
import { Button } from '@mui/material';

type PrimaryButtonProps = {
  children: string;
};

const PrimaryButton: FC<PrimaryButtonProps> = ({ children }) => {
  return (
    <Button
      sx={{
        '&:hover': {
          backgroundColor: 'black',
          opacity: 0.85,
        },
      }}
      variant="contained"
      className="bg-black">
      {children}
    </Button>
  );
};

export default PrimaryButton;
