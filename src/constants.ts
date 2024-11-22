import { UserRoleSelectOptions } from './types';

export const STORE_NAME = 'MyStore';

export const SITE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://my-store-henna.vercel.app';

export const BORDER_RADIUS = '4px';

export const MAXIMUM_PRODUCT_IMAGES = 5;

export const USER_ROLE_OPTIONS: UserRoleSelectOptions[] = ['none', 'admin', 'manager', 'owner'];

export const HAS_ADMIN_PANEL_ACCESS = ['admin', 'manager', 'owner'];

export const ORDERED_SIZES_FOR_TOGGLE_BUTTONS = [
  { label: 'XS', value: 'XS' },
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
];

export const STOREFRONT_NAV_OPTIONS = [
  { label: 'Home', path: '/' },
  { label: 'All Products', path: '/products/all-products' },
  { label: 'Men', path: '/products/men' },
  { label: 'Women', path: '/products/women' },
  { label: 'Kids', path: '/products/kids' },
  { label: 'SALE', path: '/products/sale' },
];

export const ACCOUNT_VIEW_NAV_OPTIONS = [
  { label: 'My Account', path: '/account' },
  { label: 'Orders', path: '/orders?page=1' },
  { label: 'Wishlist', path: '/wishlist' },
];

export const ADMIN_PANEL_NAV_OPTIONS = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Products', path: '/admin/products' },
  { label: 'Orders', path: '/admin/orders' },
  { label: 'Users', path: '/admin/users' },
];

export const HOME_PAGE_SHOP_BY_CATEGORY = [
  {
    label: 'Men',
    imageSrc: '/portrait-handsome-fashion-businessman-model-dressed-elegant-checkered-suit.jpg',
    path: '/products/men',
  },
  { label: 'Women', imageSrc: '/vladimir-yelizarov-xmtEdCeBsww-unsplash.jpg', path: '/products/women' },
  { label: 'Kids', imageSrc: '/terricks-noah-n9R0MN3XGvY-unsplash.jpg', path: '/products/kids' },
];

export const DATA_GRID_DEFAULTS = {
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
};

export const USER_ERROR_MESSAGES = {
  authentication: 'An error occurred during authentication. Please try again later.',
  notAuthenticated: 'You need to be signed in to perform this action',
  notAuthorized: 'You are not authorized to perform this action',
  unexpected: 'An unexpected error occurred. Please try again later.',
};

export const LOGGER_ERROR_MESSAGES = {
  authentication: 'Authentication error',
  notAuthenticated: 'User not authenticated',
  notAuthorized: 'Authorization error or user not authorized',
  parse: 'Error parsing JSON',
  noData: 'No data received',
  validation: 'Validation error',
  databaseSelect: 'Database select error',
  databaseInsert: 'Database insert error',
  databaseUpdate: 'Database update error',
  databaseDelete: 'Database delete error',
  storageDelete: 'Storage delete error',
  unexpected: 'An unexpected error occurred',
};

export const AUTHORIZATION_REQUIRED_PATHS = ['/api/secure/admin', '/admin'];

export const AUTHENTICATION_REQUIRED_PATHS = ['/api/secure', '/account', '/orders', '/wishlist', '/cart', '/checkout'];
