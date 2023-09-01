'use client';
import { FC } from 'react';
import { Button } from '@mui/material';

type PrimaryButtonProps = {
  children: string;
};

const PrimaryButton: FC<PrimaryButtonProps> = ({ children }) => {
  return (
    <Button
      className="active:scale-95"
      sx={{
        backgroundColor: 'black',
        boxShadow: 'none',
        '&:active': {
          inset: 'none',
        },
        '&:hover': {
          backgroundColor: 'black',
          boxShadow: 'none',
        },
      }}
      disableRipple={true}
      variant="contained">
      {children}
    </Button>
  );
};

export default PrimaryButton;
