import { UserRoleSelectOptions } from './types';

const storeName = 'MyStore';

export const constants = {
  url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://my-store-henna.vercel.app',
  storeName,
  storeSlogan: 'Where Fashion Meets Passion',
  storeDescription: `Immerse yourself in a world of self-expression at ${storeName}, where each piece tells a story and every outfit is a statement`,
  borderRadius: '4px',
  freeDeliveryThreshold: 500,
  userRoleOptions: ['none', 'admin', 'manager', 'owner'] as UserRoleSelectOptions[],
  hasAdminPanelAccess: ['admin', 'manager', 'owner'],
  orderedSizesForToggleButtons: [
    { label: 'XS', value: 'XS' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' },
  ],
  orderedSizesForStore: ['XS', 'S', 'M', 'L', 'XL'],
  // adminPanelNavOptions at components\AdminPanelNavOptions.tsx because of icons,
  storeFrontNavOptions: [
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
  accountViewNavOptions: [
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

  homePageShopByCategory: [
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
  dataGridDefaults: {
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
};

export const ERROR_MESSAGES = {
  NO_DATA_RECEIVED: 'No data was received in the request body.',
  NOT_AUTHENTICATED: 'Not authenticated.',
  NO_ID_RECEIVED: 'Please provide a valid ID.',
};
