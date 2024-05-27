import { Database } from './lib/supabase/database.types';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Index:
// 1. User
// 2. Cart
// 3. Checkout
// 4. Address
// 5. Order
// 6. Wishlist
// 7. Product
// 8. Payment
// 9. Admin
// 10. Data grid
// 11. Misc

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 1. User

export type UserRoleDb = Database['public']['Enums']['appRole'];

export type UserRole = UserRoleDb | null;

// Cannot use null for select component
export type UserRoleSelectOptions = UserRoleDb | 'none';

export type UserAccountFieldToEdit = 'password' | 'firstName' | 'lastName' | 'contactNumber';

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
  isOAuthSignIn: boolean;
  role: UserRole;
};

export type UpdateUserDb = {
  contactNumber?: string;
  firstName?: string;
  lastName?: string;
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
  cartItemId: number;
  quantity: number;
  size: string;
  product: {
    name: string;
    isOnSale: string;
    price: number;
    salePercentage: number;
    deliveryInfo: string;
    returnInfo: string;
    productId: number;
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
  cartItemId: number;
  size: string;
};

export type UpdateCartItemQuantity = {
  cartItemId: number;
  quantity: number;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 3. Checkout

export type CheckoutData = {
  orderAddressId: number | null;
  isCheckoutProcessing: boolean;
  orderItems: {
    pricePaid: number;
    productId: number;
    quantity: number;
    size: string;
  }[];
  orderPaymentTotals: {
    cartTotal: number;
    deliveryFee: number;
    discountTotal: number;
    orderTotal: number;
  };
  orderShippingDetails: OrderShippingDetails | null;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 4. Address

export type InsertAddressDb = Database['public']['Tables']['addresses']['Insert'];

export type AddressType = Database['public']['Tables']['addresses']['Row'];

export type UpdateAddressDb = Database['public']['Tables']['addresses']['Update'];

export type AddressStore = {
  addressId: number | null;
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

// 5. Order

export type OrderStatus = Database['public']['Enums']['orderStatus'];

export type OrderItem = {
  orderItemId: number;
  quantity: number;
  size: string;
  pricePaid: number;
  product: {
    productId: number;
    name: string;
    category: string;
    returnInfo: string;
    productImageData: {
      imageUrl: string | undefined;
      index: number;
    }[];
  } | null;
};

export type OrderShippingDetails = {
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

export type OrderData = {
  createdAt: string;
  orderId: number;
  cartTotal: number;
  discountTotal: number;
  deliveryFee: number;
  orderTotal: number;
  orderStatus: OrderStatus;
  shippingDetails: OrderShippingDetails | null;
  orderItems: OrderItem[];
  pendingCheckoutSessionId: string | null;
};

export type InsertOrderDb = {
  orderDetails: {
    cartTotal: number;
    deliveryFee: number;
    discountTotal: number;
    orderTotal: number;
    orderStatus: OrderStatus;
  };
  orderItems: { pricePaid: number; productId: number; quantity: number; size: string }[];
  shippingDetails: OrderShippingDetails;
};

export type UpdateOrderStatus = {
  orderId: number;
  orderStatus: OrderStatus;
};

export type AddOrderResponse = {
  orderId: number;
};

export type MonthlyOrderData = {
  createdAt: string;
  orderTotal: number;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 6. Wishlist

export type WishlistData = {
  productId: number;
  size: string;
};

export type InsertWishlistItemDb = Database['public']['Tables']['wishlist']['Insert'];

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 7. Product

export type ProductImageUploadProgress = {
  fileName: string;
  progress: number;
};

export type InsertProductImageDataStore = {
  imageUrl: string;
  fileName: string;
  productImageId?: number;
  index: number;
};

export type InsertProductImageDataDb = Database['public']['Tables']['productImageData']['Insert'];

export type Product = {
  productId: number;
  createdAt: string;
  category: string;
  name: string;
  brand: string;
  details: string;
  price: number;
  isOnSale: string;
  salePercentage: number;
  sizes: string[];
  deliveryInfo: string;
  returnInfo: string;
  productImageData: {
    fileName: string;
    imageUrl: string;
    productImageId: number;
    index: number;
  }[];
};

export type UpdateProductDb = Database['public']['Tables']['products']['Update'];

export type InsertProductDb = Database['public']['Tables']['products']['Insert'];

export type InsertProductStore = {
  productId?: number;
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

export type AddProduct = {
  productData: InsertProductDb;
  imageData: InsertProductImageDataStore[];
};

export type UpdateProduct = {
  productData: UpdateProductDb;
  imageData: InsertProductImageDataStore[];
};

export type BestSellersType = Array<Product & { totalQuantitySold: number | null }>;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 8. Payment

export type StripeLineItem = {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      images: string[];
    };
    unit_amount: number;
  };
  quantity: number;
};

export type StripeCheckoutData = {
  orderId: number;
  lineItems: StripeLineItem[];
};

export type StripeCheckoutSessionResponse = {
  sessionId: string;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 9. Admin

export type OrdersDataGridDataAdmin = {
  orderId: number;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
  contactNumber: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientContactNumber: string;
  province: string;
  city: string;
  orderStatus: OrderStatus;
  orderTotal: number;
};

export type UpdateOrderAdminDb = {
  orderId: number;
  recipientFirstName?: string;
  recipientLastName?: string;
  recipientContactNumber?: string;
  province?: string;
  city?: string;
  orderStatus?: OrderStatus;
};

export type AddNewUserAdminResponse = {
  userId: string;
};

export type UsersDataGridDataAdmin = {
  userId: string;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  contactNumber: string | null;
  role: UserRole;
};

export type CreateUserAdminDb = {
  contactNumber?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
};

export type UpdateUserAdminDb = {
  userId: string;
  currentRole: UserRoleSelectOptions;
  dataToUpdate: {
    contactNumber?: string;
    firstName?: string;
    lastName?: string;
    role?: UserRoleSelectOptions;
  };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 10. Data grid

export type DataGridOptions = 'users' | 'orders';

export type QueryPageDataGrid = {
  number: number;
  rows: number;
};

export type QuerySortDataGrid = {
  column: string;
  direction: string;
};

export type QueryFilterDataGrid = {
  column: string | null;
  operator: string | null;
  value: string | null;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 11. Misc
export type CustomResponse<T = unknown> = { success: boolean; message: string; data?: T };

export type CustomResponseWithData<T = unknown> = { success: boolean; message: string; data: T };

export type QueryFilterBuilder = PostgrestFilterBuilder<Database['public'], any, any[], string, any[]>;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
