import { ProductImageDataStoreType, CustomResponseType } from '@/types';
import { useScrollTrigger } from '@mui/material';
import { ClassValue, clsx } from 'clsx';
import { JSXElementConstructor, ReactElement, cloneElement } from 'react';
import { twMerge } from 'tailwind-merge';
import { deleteImageFromStorage } from './firebase';
import deleteProductImageData from '@/services/product-image-data/delete-product-image-data';
import { toast } from 'react-toastify';

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
    path: '/products/all-products',
  },
  {
    id: 'listingMen',
    label: 'Men',
    path: '/products/men',
  },
  {
    id: 'listingWomen',
    label: 'Women',
    path: '/products/women',
  },
  {
    id: 'listingKids',
    label: 'kids',
    path: '/products/kids',
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

export const toggleButtonSizeOptions = [
  { label: 'XS', value: 'XS' },
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
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
  let roundedPrice = Math.round(price);
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ZAR',
  });
  const formattedCurrency = currencyFormatter.format(roundedPrice);

  return formattedCurrency.replace('ZAR', 'R').replace('.00', '');
}

export default function createURL(path: string) {
  const IS_SERVER = typeof window === 'undefined';
  const siteUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_SITE_URL_DEVELOPMENT
      : process.env.NEXT_PUBLIC_SITE_URL_PRODUCTION;
  const baseURL = IS_SERVER ? siteUrl : window.location.origin;
  return new URL(path, baseURL).toString();
}

export async function deleteAllProductImages(
  imageData: ProductImageDataStoreType[],
  productId?: string | null
): Promise<CustomResponseType> {
  let dbDataDeleteSuccess = true;

  try {
    const storageImagesToDelete = imageData.map((data) => data.file_name);

    const storageDeletePromises = storageImagesToDelete.map(
      (file_name) => file_name.length > 0 && deleteImageFromStorage(file_name)
    );

    const storageDeleteResults = await Promise.allSettled(storageDeletePromises);

    const storageDeleteSuccess = storageDeleteResults.every((result) => result.status === 'fulfilled');

    if (productId) {
      const productImageDataToDelete = imageData.map((data) => data.product_image_id);

      const dbDataDeletePromises = productImageDataToDelete.map((product_image_id) =>
        deleteProductImageData(product_image_id!)
      );

      const dbDataDeleteResults = await Promise.allSettled(dbDataDeletePromises);

      dbDataDeleteSuccess = dbDataDeleteResults.every((result) => result.status === 'fulfilled');
    }

    if (!storageDeleteSuccess && !dbDataDeleteSuccess) {
      return { success: false, message: 'Failed to delete all images. Storage and database error.' };
    } else if (!storageDeleteSuccess) {
      return { success: false, message: 'Failed to delete all images. Storage  error.' };
    } else if (!dbDataDeleteSuccess) {
      return { success: false, message: 'Failed to delete all images. Database  error.' };
    } else {
      return { success: true, message: 'Successfully deleted all images.' };
    }
  } catch (error) {
    throw error;
  }
}

export function calculateDiscountedPrice(price: number, percentage: number) {
  return price - price * (percentage / 100);
}
