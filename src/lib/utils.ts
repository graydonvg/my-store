import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const navOptions = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
  },
  {
    id: 'listing',
    label: 'All Products',
    path: '/product/listing/all-products',
  },
  {
    id: 'listingMen',
    label: 'Men',
    path: '/product/listing/men',
  },
  {
    id: 'listingWomen',
    label: 'Women',
    path: '/product/listing/women',
  },
  {
    id: 'listingKids',
    label: 'Kids',
    path: '/product/listing/kids',
  },
  {
    id: 'myAccount',
    label: 'My account',
    path: '/user/account',
  },
  {
    id: 'signOut',
    label: 'Sign out',
    path: '/',
  },
];

export const adminNavOptions = [
  {
    id: 'adminListing',
    label: 'Manage All Products',
    path: '/admin-view/all-products',
  },
  {
    id: 'adminNewProduct',
    label: 'Add New Product',
    path: '/admin-view/add-product',
  },
  {
    id: 'myAccount',
    label: 'My account',
    path: '/user/account',
  },
  {
    id: 'signOut',
    label: 'Sign out',
    path: '/',
  },
];

export type NavOptions = typeof adminNavOptions;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
