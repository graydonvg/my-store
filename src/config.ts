export const STORE_NAME = 'MyStore';

export const BORDER_RADIUS = '4px';

export const FREE_DELIVERY_THRESHOLD = 500;

// Used to display buttons when adding a product and order buttons XS ---> XL on the product's page
export const ORDERED_SIZES_FOR_TOGGLE_BUTTONS = [
  { label: 'XS', value: 'XS' },
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
];

// Used to order buttons XS ---> XL when editing cart items
export const ORDERED_SIZES_FOR_STORE = ['XS', 'S', 'M', 'L', 'XL'];

export const ERROR_MESSAGES = {
  NO_DATA_RECEIVED: 'No data was received in the request body.',
  NOT_AUTHENTICATED: 'Not authenticated.',
  NO_ID_RECEIVED: 'Please provide a valid ID.',
};

// Admin nav options in components/adminNavOptions.tsx because of icons

export const DEFAULT_NAV_OPTIONS = [
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
];

export const ACCOUNT_NAV_OPTIONS = [
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
];

export const HOME_PAGE_CATEGORIES = [
  {
    label: 'men',
    imageSrc: '/portrait-handsome-fashion-businessman-model-dressed-elegant-checkered-suit.jpg',
    path: '/products/men',
  },
  {
    label: 'women',
    imageSrc: '/vladimir-yelizarov-xmtEdCeBsww-unsplash.jpg',
    path: '/products/women',
  },
  {
    label: 'kids',
    imageSrc: '/terricks-noah-n9R0MN3XGvY-unsplash.jpg',
    path: '/products/kids',
  },
];
