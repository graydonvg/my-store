import { UserRoleSelectOptions } from './types';

const STORE_NAME = 'MyStore';

export const CONSTANTS = {
  URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://my-store-henna.vercel.app',
  STORE_NAME,
  STORE_SLOGAN: 'Where Fashion Meets Passion',
  STORE_DESCRIPTION: `Immerse yourself in a world of self-expression at ${STORE_NAME}, where each piece tells a story and every outfit is a statement`,
  BORDER_RADIUS: '4px',
  FREE_DELIVERY_THRESHOLD: 500,
  MAXIMUM_PRODUCT_IMAGES: 5,
  USER_ROLE_OPTIONS: ['none', 'admin', 'manager', 'owner'] as UserRoleSelectOptions[],
  HAS_ADMIN_PANEL_ACCESS: ['admin', 'manager', 'owner'],
  ORDERED_SIZES_FOR_TOGGLE_BUTTONS: [
    { label: 'XS', value: 'XS' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' },
  ],
  ORDERED_SIZES_FOR_STORE: ['XS', 'S', 'M', 'L', 'XL'],
  STOREFRONT_NAV_OPTIONS: [
    {
      label: 'Home',
      path: '/',
    },
    {
      label: 'All Products',
      path: '/products/all-products',
    },
    {
      label: 'Men',
      path: '/products/men',
    },
    {
      label: 'Women',
      path: '/products/women',
    },
    {
      label: 'Kids',
      path: '/products/kids',
    },
    {
      label: 'SALE',
      path: '/products/sale',
    },
  ],
  ACCOUNT_VIEW_NAV_OPTIONS: [
    {
      label: 'My Account',
      path: '/account',
    },
    {
      label: 'Orders',
      path: '/orders',
    },
    {
      label: 'Wishlist',
      path: '/wishlist',
    },
  ],
  ADMIN_PANEL_NAV_OPTIONS: [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      label: 'Products',
      path: '/admin/products',
    },
    {
      label: 'Orders',
      path: '/admin/orders',
    },
    {
      label: 'Users',
      path: '/admin/users',
    },
  ],
  HOME_PAGE_SHOP_BY_CATEGORY: [
    {
      label: 'Men',
      imageSrc: '/portrait-handsome-fashion-businessman-model-dressed-elegant-checkered-suit.jpg',
      path: '/products/men',
    },
    {
      label: 'Women',
      imageSrc: '/vladimir-yelizarov-xmtEdCeBsww-unsplash.jpg',
      path: '/products/women',
    },
    {
      label: 'Kids',
      imageSrc: '/terricks-noah-n9R0MN3XGvY-unsplash.jpg',
      path: '/products/kids',
    },
  ],
  DATA_GRID_DEFAULTS: {
    page: {
      number: 1,
      rows: 5,
    },
    sort: {
      column: 'createdAt',
      direction: 'desc',
    },
    filter: {
      column: null,
      operator: null,
      value: null,
    },
  },
  USER_ERROR_MESSAGES: {
    AUTHENTICATION: 'An error occured during authentication. Please try again later.',
    NOT_AUTHENTICATED: 'You need to be signed in in to perform this action',
    NOT_AUTHORIZED: 'You are not authorized to perform this action',
    UNEXPECTED: 'An unexpected error occurred. Please try again later.',
  },
  LOGGER_ERROR_MESSAGES: {
    AUTHENTICATION: 'Authentication error',
    NOT_AUTHENTICATED: 'User not authenticated',
    NOT_AUTHORIZED: 'Authorization error or user not authorized',
    PARSE: 'Error parsing JSON',
    NO_DATA: 'No data received',
    VALIDATION: 'Validation error',
    DATABASE_SELECT: 'Database select error',
    DATABASE_INSERT: 'Database insert error',
    DATABASE_UPDATE: 'Database update error',
    DATABASE_DELETE: 'Database delete error',
    UNEXPECTED: 'An unexpected error occurred',
  },
};

export const ERROR_MESSAGES = {
  NO_DATA_RECEIVED: 'No data was received in the request body.',
  NOT_AUTHENTICATED: 'Not authenticated.',
  NO_ID_RECEIVED: 'Please provide a valid ID.',
};
