import { Box, BoxProps } from '@mui/material';
import { ReactNode, forwardRef } from 'react';

type UpperNavbarOptionsContainerProps = BoxProps & {
  children: ReactNode;
};

const UpperNavbarOptionsContainer = forwardRef<HTMLButtonElement, UpperNavbarOptionsContainerProps>(
  function MyComponent(props, ref) {
    const { children } = props;
    return (
      <Box
        tabIndex={-1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
        {...props}
        ref={ref}>
        {children}
      </Box>
    );
  }
);

export default UpperNavbarOptionsContainer;
