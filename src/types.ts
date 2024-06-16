import { z } from 'zod';
import { Database } from './lib/supabase/database.types';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Sections:
// Common schemas
// User
// Cart
// Checkout
// Address
// Order
// Wishlist
// Product
// Payment
// Data grid
// Misc

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Common schemas

const NoNumbersInString = z
  .string()
  .trim()
  .min(1)
  .refine((value) => !/\d/.test(value), {
    message: 'String must not contain numbers',
  });

export const NumericIdSchema = z.coerce.number().int().positive();
export const StringIdSchema = z.string();

const FirstNameSchema = NoNumbersInString;
const LastNameSchema = NoNumbersInString;
const ContactNumberSchema = z.string().trim().min(1);

const ComplexOrBuildingSchema = z.string().trim().nullable();
const StreetAddressSchema = z.string().min(1).trim();
const SuburbSchema = NoNumbersInString;
const CitySchema = NoNumbersInString;
const ProvinceSchema = NoNumbersInString;
const PostalCodeSchema = z.coerce.number().int().min(1000).max(9999);

const ItemQuantitySchema = z.number().int().positive();
const ItemSizeSchema = z.string();

const ProductIdSchema = z.number().int().positive();

const PriceSchema = z.number().positive();
const NonnegativeNumberSchema = z.number().nonnegative();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// User

const UserRoleSchema = z.enum(['admin', 'manager', 'owner']);
export type UserRole = z.infer<typeof UserRoleSchema>;

const UserRoleSelectOptionsSchema = z.enum(['none', 'admin', 'manager', 'owner']);
export type UserRoleSelectOptions = z.infer<typeof UserRoleSelectOptionsSchema>;

export type UserAccountFieldToEdit = 'password' | 'firstName' | 'lastName' | 'contactNumber';

export const UserAuthDataSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim(),
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
  firstName: FirstNameSchema.optional(),
  lastName: LastNameSchema.optional(),
  contactNumber: ContactNumberSchema.optional(),
});
export type UpdateUserData = z.infer<typeof UpdateUserDataSchema>;

export type UpdatePassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const UserDataToUpdateAdminSchema = z.object({
  firstName: FirstNameSchema.optional(),
  lastName: LastNameSchema.optional(),
  contactNumber: ContactNumberSchema.optional(),
  role: UserRoleSelectOptionsSchema.optional(),
});

export const UpdateUserAdminSchema = z.object({
  userId: StringIdSchema,
  currentRole: UserRoleSelectOptionsSchema,
  dataToUpdate: UserDataToUpdateAdminSchema,
});
export type UpdateUserAdmin = z.infer<typeof UpdateUserAdminSchema>;

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

// Cart

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

export const InsertCartItemSchema = z.object({
  productId: ProductIdSchema,
  quantity: ItemQuantitySchema,
  size: ItemSizeSchema,
});
export type InsertCartItem = z.infer<typeof InsertCartItemSchema>;

export const UpdateCartItemSizeSchema = z.object({
  cartItemId: NumericIdSchema,
  size: ItemSizeSchema,
});
export type UpdateCartItemSize = z.infer<typeof UpdateCartItemSizeSchema>;

export const UpdateCartItemQuantitySchema = z.object({
  cartItemId: NumericIdSchema,
  quantity: ItemQuantitySchema,
});
export type UpdateCartItemQuantity = z.infer<typeof UpdateCartItemQuantitySchema>;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Checkout

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

// Address

export type AddressType = Database['public']['Tables']['addresses']['Row'];

export const InsertAddressSchema = z.object({
  recipientFirstName: FirstNameSchema,
  recipientLastName: LastNameSchema,
  recipientContactNumber: ContactNumberSchema,
  complexOrBuilding: ComplexOrBuildingSchema,
  streetAddress: StreetAddressSchema,
  suburb: SuburbSchema,
  city: CitySchema,
  province: ProvinceSchema,
  postalCode: PostalCodeSchema,
});
export type InsertAddress = z.infer<typeof InsertAddressSchema>;

export const UpdateAddressSchema = z.object({
  addressId: NumericIdSchema,
  recipientFirstName: FirstNameSchema,
  recipientLastName: LastNameSchema,
  recipientContactNumber: ContactNumberSchema,
  complexOrBuilding: ComplexOrBuildingSchema,
  streetAddress: StreetAddressSchema,
  suburb: SuburbSchema,
  city: CitySchema,
  province: ProvinceSchema,
  postalCode: PostalCodeSchema,
});
export type UpdateAddress = z.infer<typeof UpdateAddressSchema>;

type PostalCode = z.infer<typeof PostalCodeSchema>;

export type AddressStore = {
  addressId: number | null;
  recipientFirstName: string;
  recipientLastName: string;
  recipientContactNumber: string;
  complexOrBuilding: string | null;
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: '' | PostalCode;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Order
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

const OrderShippingDetailsSchema = z.object({
  recipientFirstName: FirstNameSchema,
  recipientLastName: LastNameSchema,
  recipientContactNumber: ContactNumberSchema,
  complexOrBuilding: ComplexOrBuildingSchema,
  streetAddress: StreetAddressSchema,
  suburb: SuburbSchema,
  city: CitySchema,
  province: ProvinceSchema,
  postalCode: PostalCodeSchema,
});
export type OrderShippingDetailsType = z.infer<typeof OrderShippingDetailsSchema>;

const InsertOrderItemSchema = z.object({
  productId: NumericIdSchema,
  quantity: ItemQuantitySchema,
  size: ItemSizeSchema,
  pricePaid: PriceSchema,
});
type InsertOrderItem = z.infer<typeof InsertOrderItemSchema>;

const OrderDetailsSchema = z.object({
  cartTotal: PriceSchema,
  deliveryFee: NonnegativeNumberSchema,
  discountTotal: NonnegativeNumberSchema,
  orderTotal: PriceSchema,
  orderStatus: OrderStatusSchema,
});

export const InsertOrderSchema = z.object({
  orderDetails: OrderDetailsSchema,
  orderItems: InsertOrderItemSchema.array().min(1),
  shippingDetails: OrderShippingDetailsSchema,
});
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

export const UpdateOrderSchema = z.object({
  orderId: NumericIdSchema,
  recipientFirstName: FirstNameSchema.optional(),
  recipientLastName: LastNameSchema.optional(),
  recipientContactNumber: ContactNumberSchema.optional(),
  complexOrBuilding: ComplexOrBuildingSchema.optional(),
  streetAddress: StreetAddressSchema.optional(),
  suburb: SuburbSchema.optional(),
  city: NoNumbersInString.optional(),
  province: ProvinceSchema.optional(),
  postalCode: PostalCodeSchema.optional(),
  orderStatus: OrderStatusSchema.optional(),
  orderTotal: PriceSchema.optional(),
});
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  orderId: NumericIdSchema,
  orderStatus: OrderStatusSchema,
});
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;

export type AddOrderResponse = {
  orderId: number;
};

export type MonthlyOrderData = {
  createdAt: string;
  orderTotal: number;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Wishlist

export type WishlistData = {
  productId: number;
  size: string;
};

export const InsertWishlistItemSchema = z.object({
  productId: NumericIdSchema,
  size: ItemSizeSchema,
});
export type InsertWishlistItemDb = z.infer<typeof InsertWishlistItemSchema>;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Product

export const ProductCategorySchema = z.enum(['Men', 'Women', 'Kids']);

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

// Payment

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

// Data grid

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

// Misc
export type CustomResponse<T = unknown> = { success: boolean; message: string; data?: T };

export type ResponseWithNoData = { success: boolean; message: string };

export type ResponseWithData<T = unknown> = { success: boolean; message: string; data: T };

export type QueryFilterBuilder = PostgrestFilterBuilder<Database['public'], any, any[], string, any[]>;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
