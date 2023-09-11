import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const navOptions = [
  {
    id: 'all-products',
    label: 'all Products',
    path: '/browse/all-products',
  },
  {
    id: 'women',
    label: 'women',
    path: '/browse/women',
  },
  {
    id: 'men',
    label: 'men',
    path: '/browse/men',
  },
  {
    id: 'smartphones',
    label: 'smartphones',
    path: '/browse/smartphones',
  },
  {
    id: 'tech',
    label: 'tech',
    path: '/browse/tech',
  },
  {
    id: 'home-and-living',
    label: 'home + living',
    path: '/browse/home-and-living',
  },
  {
    id: 'beauty',
    label: 'beauty',
    path: '/browse/beauty',
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
];

export type NavOptionsType = (typeof navOptions)[0];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
