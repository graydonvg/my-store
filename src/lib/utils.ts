import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const navOptions = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    temporaryDrawerOnly: false,
    authRequired: false,
  },
  {
    id: 'listing',
    label: 'All Products',
    path: '/product/listing/all-products',
    temporaryDrawerOnly: false,
    authRequired: false,
  },
  {
    id: 'listingMen',
    label: 'Men',
    path: '/product/listing/men',
    temporaryDrawerOnly: false,
    authRequired: false,
  },
  {
    id: 'listingWomen',
    label: 'Women',
    path: '/product/listing/women',
    temporaryDrawerOnly: false,
    authRequired: false,
  },
  {
    id: 'listingKids',
    label: 'Kids',
    path: '/product/listing/kids',
    temporaryDrawerOnly: false,
    authRequired: false,
  },
  {
    id: 'myAccount',
    label: 'My account',
    path: '/user/account',
    temporaryDrawerOnly: true,
    authRequired: true,
  },
  {
    id: 'signOut',
    label: 'Sign out',
    path: '/',
    temporaryDrawerOnly: true,
    authRequired: true,
  },
];

export const adminNavOptions = [
  {
    id: 'adminListing',
    label: 'Manage All Products',
    path: '/admin-view/all-products',
    temporaryDrawerOnly: false,
    authRequired: false,
  },
  {
    id: 'adminNewProduct',
    label: 'Add New Product',
    path: '/admin-view/add-product',
    temporaryDrawerOnly: false,
    authRequired: false,
  },
  {
    id: 'myAccount',
    label: 'My account',
    path: '/user/account',
    temporaryDrawerOnly: true,
    authRequired: true,
  },
  {
    id: 'signOut',
    label: 'Sign out',
    path: '/',
    temporaryDrawerOnly: true,
    authRequired: true,
  },
];

export type NavOptionsType = (typeof navOptions)[0];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
