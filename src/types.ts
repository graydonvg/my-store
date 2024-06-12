import { z } from 'zod';
import { Database } from './lib/supabase/database.types';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

const NoNumbersInString = z
  .string()
  .trim()
  .min(1)
  .refine((value) => !/\d/.test(value), {
    message: 'String must not contain numbers',
  });

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

const ContactNumberSchema = z.string().trim().min(1);

const UserRoleSchema = z.enum(['admin', 'manager', 'owner']);
export type UserRole = z.infer<typeof UserRoleSchema>;

const UserRoleSelectOptionsSchema = z.enum(['none', 'admin', 'manager', 'owner']);
export type UserRoleSelectOptions = z.infer<typeof UserRoleSelectOptionsSchema>;

export type UserAccountFieldToEdit = 'password' | 'firstName' | 'lastName' | 'contactNumber';

export const UserAuthDataSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type UserAuthData = z.infer<typeof UserAuthDataSchema>;

export type UserData = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  contactNumber: string | null;
  isOAuthSignIn: boolean;
  role: UserRole | null;
};

export const UpdateUserDataSchema = z.object({
  contactNumber: ContactNumberSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
export type UpdateUserData = z.infer<typeof UpdateUserDataSchema>;

export type userPasswordType = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const UserDataToUpdateSchema = z.object({
  firstName: NoNumbersInString.optional(),
  lastName: NoNumbersInString.optional(),
  contactNumber: ContactNumberSchema.optional(),
  role: UserRoleSelectOptionsSchema.optional(),
});

export const UpdateUserAdminSchema = z.object({
  userId: z.string(),
  currentRole: UserRoleSelectOptionsSchema,
  dataToUpdate: UserDataToUpdateSchema,
});
export type UpdateUserAdmin = z.infer<typeof UpdateUserAdminSchema>;

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
    productImageData: {
      imageUrl: string;
    }[];
  } | null;
};

export type CartItemWithPriceDetails = {
  totalStandardPrice: number;
  totalDiscountedPrice: number | null;
} & CartItem;

export const InsertCartItemSchema = z
  .object({
    productId: z.number().positive(),
    quantity: z.number().positive(),
    size: z.string(),
  })
  .strict();

export type InsertCartItem = z.infer<typeof InsertCartItemSchema>;

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
  checkoutItems: InsertOrderItem[];
  orderPaymentTotals: {
    cartTotal: number;
    deliveryFee: number;
    discountTotal: number;
    orderTotal: number;
  };
  orderShippingDetails: OrderShippingDetailsType | null;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 4. Address

export type InsertAddressDb = Database['public']['Tables']['addresses']['Insert'];

export type AddressType = Database['public']['Tables']['addresses']['Row'];

export type UpdateAddressDb = Database['public']['Tables']['addresses']['Update'];

const PostalCodeSchema = z.number().int().min(1000).max(9999);
type PostalCode = z.infer<typeof PostalCodeSchema>;

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
  postalCode: '' | PostalCode;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 5. Order
const OrderStatusSchema = z.enum([
  'awaiting payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'refunded',
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

const OrderShippingDetailsSchema = z
  .object({
    recipientFirstName: z.string(),
    recipientLastName: z.string(),
    recipientContactNumber: z.string(),
    complexOrBuilding: z.string().nullable(),
    streetAddress: z.string(),
    suburb: z.string(),
    province: z.string(),
    city: z.string(),
    postalCode: PostalCodeSchema,
  })
  .strict();
export type OrderShippingDetailsType = z.infer<typeof OrderShippingDetailsSchema>;

const InsertOrderItemSchema = z
  .object({
    productId: z.number().positive(),
    quantity: z.number().positive(),
    size: z.string(),
    pricePaid: z.number().positive(),
  })
  .strict();
type InsertOrderItem = z.infer<typeof InsertOrderItemSchema>;

const OrderDetailsSchema = z
  .object({
    cartTotal: z.number().positive(),
    deliveryFee: z.number().nonnegative(),
    discountTotal: z.number().nonnegative(),
    orderTotal: z.number().positive(),
    orderStatus: OrderStatusSchema,
  })
  .strict();

export const InsertOrderSchema = z
  .object({
    orderDetails: OrderDetailsSchema,
    orderItems: InsertOrderItemSchema.array().min(1),
    shippingDetails: OrderShippingDetailsSchema,
  })
  .strict();
export type InsertOrder = z.infer<typeof InsertOrderSchema>;

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
    }[];
  } | null;
};

export type OrderData = {
  createdAt: string;
  orderId: number;
  cartTotal: number;
  discountTotal: number;
  deliveryFee: number;
  orderTotal: number;
  orderStatus: OrderStatus;
  shippingDetails: OrderShippingDetailsType | null;
  orderItems: OrderItem[];
  pendingCheckoutSessionId: string | null;
};

export const UpdateOrderSchema = z.object({
  orderId: z.number().positive(),
  recipientFirstName: NoNumbersInString.optional(),
  recipientLastName: NoNumbersInString.optional(),
  recipientContactNumber: ContactNumberSchema.optional(),
  complexOrBuilding: z.string().trim().nullable().optional(),
  streetAddress: z.string().min(1).trim().optional(),
  suburb: NoNumbersInString.optional(),
  province: NoNumbersInString.optional(),
  city: NoNumbersInString.optional(),
  postalCode: z.number().int().min(1000).max(9999).optional(),
  orderStatus: OrderStatusSchema.optional(),
  orderTotal: z.number().positive().optional(),
});
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;

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
  complexOrBuilding: string | null;
  streetAddress: string;
  suburb: string;
  province: string;
  city: string;
  postalCode: PostalCode;
  orderStatus: OrderStatus;
  orderTotal: number;
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
  role: UserRole | null;
};

export type CreateUserAdminDb = {
  contactNumber?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole | null;
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

export type ResponseWithNoData = { success: boolean; message: string };

export type ResponseWithData<T = unknown> = { success: boolean; message: string; data: T };

export type QueryFilterBuilder = PostgrestFilterBuilder<Database['public'], any, any[], string, any[]>;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
