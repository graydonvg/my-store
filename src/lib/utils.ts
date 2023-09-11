import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
    id: 'smartphones',
    label: 'Smartphones',
    path: '/browse/smartphones',
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
