import { useScrollTrigger } from '@mui/material';
import { ClassValue, clsx } from 'clsx';
import { JSXElementConstructor, ReactElement, cloneElement } from 'react';
import { twMerge } from 'tailwind-merge';

type ElevationScrollProps = { children: ReactElement<any, string | JSXElementConstructor<any>> };
export function ElevationScroll({ children }: ElevationScrollProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    // target: window ? window() : undefined,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const navOptions = [
  {
    id: 'all-products',
    label: 'All Products',
    path: '/browse/all-products',
  },
  {
    id: 'women',
    label: 'Women',
    path: '/browse/women',
  },
  {
    id: 'men',
    label: 'Men',
    path: '/browse/men',
  },
  {
    id: 'electronics',
    label: 'Electronics',
    path: '/browse/tech',
  },
  {
    id: 'home-and-living',
    label: 'Home + Living',
    path: '/browse/home-and-living',
  },
  {
    id: 'beauty',
    label: 'Beauty',
    path: '/browse/beauty',
  },
];

export type NavOptionsType = (typeof navOptions)[0];

// export const adminNavOptions = [
//   {
//     id: 'adminListing',
//     label: 'Manage All Products',
//     path: '/admin-view/all-products',
//   },
//   {
//     id: 'adminNewProduct',
//     label: 'Add New Product',
//     path: '/admin-view/add-product',
//   },
// ];
