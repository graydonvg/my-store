'use client';

import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import { LocalShippingOutlined, NavigateNext, Payment, ShoppingCart } from '@mui/icons-material';
import { Box } from '@mui/material';
import { MouseEvent } from 'react';

function handleClick(event: MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

type Props = {
  hideText: boolean;
};

export default function IconBreadcrumbs({ hideText }: Props) {
  return (
    <Box
      role="presentation"
      onClick={(e) => e}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ color: 'white' }}>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingCart
            sx={{ mr: 1 }}
            fontSize="small"
          />
          {!hideText ? <Typography textTransform="uppercase">Cart</Typography> : null}
        </Link>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center' }}>
          <LocalShippingOutlined
            sx={{ mr: 1 }}
            fontSize="small"
          />
          {!hideText ? <Typography textTransform="uppercase">Shipping</Typography> : null}
        </Link>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center' }}>
          <Payment
            sx={{ mr: 1 }}
            fontSize="small"
          />
          {!hideText ? <Typography textTransform="uppercase">Payment</Typography> : null}
        </Link>
      </Breadcrumbs>
    </Box>
  );
}
