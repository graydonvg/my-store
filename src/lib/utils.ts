import { useScrollTrigger } from '@mui/material';
import { ClassValue, clsx } from 'clsx';
import { JSXElementConstructor, ReactElement, cloneElement } from 'react';
import { twMerge } from 'tailwind-merge';

export const categories = ['Men', 'Women', 'kids'];

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
    label: 'kids',
    path: '/product/listing/kids',
  },
];

export const adminNavOptions = [
  {
    id: 'adminViewHome',
    label: 'Home',
    path: '/admin-view',
  },
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

export function ElevationScroll({ children }: { children: ReactElement<any, string | JSXElementConstructor<any>> }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUniqueFileName(fileName: string) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 12);

  return `${fileName}-${timestamp}-${randomString}`;
}

export function getEmptyFormFields(formData: {}): string[] {
  const unfilledFields: string[] = [];

  for (const key in formData) {
    const fieldValue = formData[key as keyof typeof formData] as {};

    if (
      fieldValue === undefined ||
      (typeof fieldValue === 'string' && fieldValue.trim() === '') ||
      (Array.isArray(fieldValue) && fieldValue.length === 0) ||
      fieldValue === '' ||
      fieldValue === null
    ) {
      unfilledFields.push(key);
    }
  }

  return unfilledFields;
}

export function getNumberOfFormFields(formData: {}): number {
  const formFieldsArray = [];

  for (const key in formData) {
    formFieldsArray.push(key);
  }

  return formFieldsArray.length;
}

export function formatCurrency(price: number) {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ZAR',
  });
  const formattedCurrency = currencyFormatter.format(price);
  return formattedCurrency.replace('ZAR', 'R');
}

export default function getURL(path: string) {
  const IS_SERVER = typeof window === 'undefined';
  const siteUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_SITE_URL_DEVELOPMENT
      : process.env.NEXT_PUBLIC_SITE_URL_PRODUCTION;
  const baseURL = IS_SERVER ? siteUrl : window.location.origin;
  return new URL(path, baseURL).toString();
}
