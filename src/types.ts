import { ChangeEvent } from 'react';
import { Database } from './lib/supabase/database.types';
import { GridSortDirection } from '@mui/x-data-grid';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Index:
// 1. User
// 2. Cart
// 3. Checkout
// 4. Address
// 5. Shipping
// 6. Order
// 7. Wishlist
// 8. Product
// 9. Payment
// 10. Admin
// 11. Data grid
// 12. Misc

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 1. User

export type UserRole = Database['public']['Enums']['appRole'] | null;

export type UserAccountFieldToEdit = 'password' | 'firstName' | 'lastName' | 'contactNumber';

export type UserAccountTextFieldData = {
  id: string;
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDownFunction: () => void;
};

export type UserAuthData = {
  email: string;
  password: string;
};

export type UserData = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  contactNumber: string | null;
  addresses: Address[];
  isOAuthSignIn: boolean;
  role: UserRole;
};

export type UpdateUserPersonalInformationDb = {
  userId?: string;
  contactNumber?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
};

export type userPasswordType = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 2. Cart

export type CartItem = {
  createdAt: string;
  cartItemId: string;
  quantity: number;
  size: string;
  product: {
    name: string;
    isOnSale: string;
    price: number;
    salePercentage: number;
    deliveryInfo: string;
    returnInfo: string;
    productId: string;
    sizes: string[];
    brand: string;
    category: string;
    productImageData:
      | {
          imageUrl: string;
          index: number;
        }[];
  } | null;
};

export type InsertCartItemDb = Database['public']['Tables']['cart']['Insert'];

export type UpdateCartItemSize = {
  cartItemId: string;
  size: string;
};

export type UpdateCartItemQuantity = {
  cartItemId: string;
  quantity: number;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 3. Checkout

export type CheckoutData = {
  selectedAddressId: string | null;
  isProcessing: boolean;
  orderItems: {
    pricePaid: number;
    productId: string;
    quantity: number;
    size: string;
  }[];
  paymentTotals: {
    cartTotal: number;
    deliveryFee: number;
    discountTotal: number;
    orderTotal: number;
  };
  shippingDetails: ShippingDetails | null;
  orderId: string | null;
  userId: string | null;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 4. Address

export type InsertAddressDb = Database['public']['Tables']['addresses']['Insert'];

export type Address = Database['public']['Tables']['addresses']['Row'];

export type UpdateAddressDb = Database['public']['Tables']['addresses']['Update'];

export type AddressStore = {
  addressId: string;
  recipientContactNumber: string;
  recipientFirstName: string;
  recipientLastName: string;
  city: string;
  complexOrBuilding: string | null;
  province: string;
  streetAddress: string;
  suburb: string;
  postalCode: '' | number;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 5. Shipping

export type ShippingDetails = {
  recipientFirstName: string;
  recipientLastName: string;
  recipientContactNumber: string;
  complexOrBuilding: string | null;
  streetAddress: string;
  suburb: string;
  province: string;
  city: string;
  postalCode: number;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 6. Order

export type OrderItem = {
  orderItemId: string;
  quantity: number;
  size: string;
  pricePaid: number;
  product: {
    productId: string;
    name: string;
    category: string;
    returnInfo: string;
    productImageData: {
      imageUrl: string | undefined;
      index: number;
    }[];
  } | null;
};

export type OrderData = {
  createdAt: string;
  orderId: string;
  cartTotal: number;
  discountTotal: number;
  deliveryFee: number;
  orderTotal: number;
  isPaid: boolean;
  shippingDetails: ShippingDetails[];
  orderItems: OrderItem[];
};

export type InsertOrderDb = {
  orderDetails: {
    cartTotal: number;
    deliveryFee: number;
    discountTotal: number;
    isPaid: boolean;
    orderTotal: number;
  };
  orderItems: { pricePaid: number; productId: string; quantity: number; size: string }[];
  shippingDetails: ShippingDetails;
};

export type UpdateOrderPaymentStatus = {
  orderId: string;
  isPaid: boolean;
};

export type AddOrderResponse = {
  orderId: string;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 7. Wishlist

export type WishlistData = {
  size: string;
  productId: string;
};

export type WishlistItem = {
  wishlistItemId: string;
  size: string;
  product: Product;
};

export type InsertWishlistItemDb = Database['public']['Tables']['wishlist']['Insert'];

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 8. Product

export type ProductImageUploadProgress = {
  fileName: string;
  progress: number;
};

export type InsertProductImageDataStore = {
  imageUrl: string;
  fileName: string;
  productImageId?: string;
  index: number;
};

export type InsertProductImageDataDb = Database['public']['Tables']['productImageData']['Insert'];

export type Product = {
  brand: string;
  category: string;
  createdAt: string;
  deliveryInfo: string;
  details: string;
  isOnSale: string;
  name: string;
  price: number;
  productId: string;
  returnInfo: string;
  salePercentage: number;
  sizes: string[];
  productImageData: {
    fileName: string;
    imageUrl: string;
    productImageId: string;
    index: number;
  }[];
};

export type UpdateProductDb = Database['public']['Tables']['products']['Update'];

export type InsertProductDb = Database['public']['Tables']['products']['Insert'];

export type InsertProductStore = {
  productId?: string;
  brand: string;
  category: string;
  deliveryInfo: string;
  details: string;
  isOnSale: string;
  name: string;
  returnInfo: string;
  sizes: string[];
  price: '' | number;
  salePercentage: '' | number;
};

export type AddProductResponse = {
  productId: string;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 9. Payment

export type StripeCheckoutSessionResponse = {
  sessionId: string;
};

export type StripeLineItem = {
  price_data: {
    currency: string;
    product_data: {
      name: string | undefined;
      images: string[];
    };
    unit_amount: number;
  };
  quantity: number;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 10. Admin

export type AdminOrdersTableOrderData = {
  createdAt: string;
  orderId: string;
  orderTotal: number;
  isPaid: boolean;
  user: {
    firstName: string | null;
    lastName: string | null;
  } | null;
  shippingDetails: {
    province: string;
    city: string;
  }[];
};

export type AdminAddNewUserResponse = {
  userId: string;
};

export type AdminUsersTableUserData = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  contactNumber: string | null;
  createdAt: string;
  role: UserRole;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 11. Data grid

export type DataGridFilterOperators =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'is'
  | 'not'
  | '='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<=';

export type DataGridFilter<T> = {
  column: T | null;
  operator: DataGridFilterOperators | null;
  value: string;
};

export type DataGridSort<T> = {
  by: T;
  direction: GridSortDirection;
};

export type DataGridQueryData<T, U> = {
  page: {
    number: number;
    rows: number;
  };
  range: {
    start: number;
    end: number;
  };
  sort: DataGridSort<U>;
  filter: DataGridFilter<T>;
};

export type AdminOrdersDataGridSortableColumns = 'date' | 'name' | 'ship_to' | 'order_total' | 'status';

export type AdminUsersDataGridFilterableColumns =
  | 'userId'
  | 'createdAt'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'contactNumber'
  | 'role';

export type AdminUsersDataGridSortableColumns =
  | 'createdAt'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'contactNumber'
  | 'role';

export type AdminUsersDataGridQueryFilterBuilder = PostgrestFilterBuilder<
  Database['public'],
  Database['public']['Tables']['users'],
  any[],
  'users',
  any[]
>;

export type AdminUsersDataGridQueryFilterBuilderResponse = PostgrestFilterBuilder<
  Database['public'],
  Database['public']['Tables']['users'],
  AdminUsersTableUserData[],
  'users',
  any[]
>;

export type DataGridInvalidFlags = {
  filterColumn?: boolean;
  filterOperator?: boolean;
  sortColumn?: boolean;
  sortDirection?: boolean;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 12. Misc
export type CustomResponse<T = unknown> = { success: boolean; message: string; data?: T };

export type QueryFilterBuilder = PostgrestFilterBuilder<Database['public'], any, any[], string, any[]>;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
