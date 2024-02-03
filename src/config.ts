export const BORDER_RADIUS = '4px';

export const ACCOUNT_MENU_ICON_COLOR = 'white';
export const ACCOUNT_MENU_ICON_SIZE = 'small';

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

export const DEFAULT_NAV_OPTIONS = [
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
    label: 'Kids',
    path: '/products/kids',
  },
  {
    id: 'listingSale',
    label: 'SALE',
    path: '/products/sale',
  },
];

export const ADMIN_NAV_OPTIONS = [
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

export const ACCOUNT_NAV_OPTIONS = [
  {
    id: 'myAccount',
    label: 'My Account',
    path: '/account',
  },
  {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    path: '/wishlist',
  },
];
