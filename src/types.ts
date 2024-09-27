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
const PasswordSchema = z.string().trim().min(6);

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

export const UserRoleSchema = z.enum(['admin', 'manager', 'owner']).nullable();
export type UserRole = z.infer<typeof UserRoleSchema>;

const UserRoleSelectOptionsSchema = z.enum(['none', 'admin', 'manager', 'owner']);
export type UserRoleSelectOptions = z.infer<typeof UserRoleSelectOptionsSchema>;

export type UserAccountFieldToEdit = 'password' | 'firstName' | 'lastName' | 'contactNumber';

export const UserAuthDataSchema = z.object({
  email: z.string().trim().email(),
  password: PasswordSchema,
});
export type UserAuthData = z.infer<typeof UserAuthDataSchema>;

export type UserData = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  contactNumber: string | null;
  isOAuthSignIn: boolean;
  oAuthName: string | null;
  role: UserRole;
};

export const UserPersonalInfoSchema = z.object({
  firstName: FirstNameSchema.optional(),
  lastName: LastNameSchema.optional(),
  contactNumber: ContactNumberSchema.optional(),
});
export type UserPersonalInfo = z.infer<typeof UserPersonalInfoSchema>;

export const UpdatePasswordSchema = z.object({
  currentPassword: PasswordSchema,
  newPassword: PasswordSchema,
  confirmPassword: PasswordSchema,
});
export type UpdatePassword = z.infer<typeof UpdatePasswordSchema>;

export const UserDataToUpdateAdminSchema = z.object({
  firstName: FirstNameSchema.optional(),
  lastName: LastNameSchema.optional(),
  contactNumber: ContactNumberSchema.nullable().optional(),
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

export type UsersDataGrid = {
  userId: string;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  contactNumber: string | null;
  role: UserRole;
};

export type CreateUser = {
  contactNumber?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
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
    isOnSale: boolean;
    price: number;
    salePercentage: number;
    deliveryInfo: string;
    returnInfo: string;
    productId: number;
    sizes: string[];
    brand: string;
    category: ProductCategory;
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
    category: ProductCategory;
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

export type OrdersDataGrid = {
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

export type OrderDateTotal = {
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
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

const ProductSalePercentageSchema = z.number().min(0).max(100);

export type ProductImageUploadProgress = {
  fileName: string;
  progress: number;
};

const ProductImageDataSchema = z.object({
  productImageId: NumericIdSchema.optional(),
  imageIndex: z.number().int().nonnegative(),
  fileName: z.string(),
  imageUrl: z.string().url(),
});
export type ProductImageData = z.infer<typeof ProductImageDataSchema>;

export type ProductData = {
  productId: number;
  createdAt: string;
  category: ProductCategory;
  name: string;
  brand: string;
  details: string;
  price: number;
  isOnSale: boolean;
  salePercentage: number;
  sizes: string[];
  deliveryInfo: string;
  returnInfo: string;
};

export type Product = ProductData & {
  productImageData: ProductImageData[];
};

export type ProductForm = {
  productId?: number;
  brand: string;
  category: ProductCategory | '';
  deliveryInfo: string;
  details: string;
  isOnSale: boolean | '';
  name: string;
  returnInfo: string;
  sizes: string[];
  price: '' | number;
  salePercentage: '' | number;
};

const ProductDataSchema = z.object({
  category: ProductCategorySchema,
  name: z.string().trim(),
  brand: z.string().trim(),
  details: z.string().trim(),
  sizes: z.string().array(),
  deliveryInfo: z.string().trim(),
  returnInfo: z.string().trim(),
  price: PriceSchema,
  isOnSale: z.boolean(),
  salePercentage: ProductSalePercentageSchema,
});

export type InsertProductData = z.infer<typeof ProductDataSchema>;

export const AddProductSchema = z.object({
  productData: ProductDataSchema,
  imageData: ProductImageDataSchema.array(),
});
export type AddProduct = z.infer<typeof AddProductSchema>;

const UpdateProductDataSchema = ProductDataSchema.extend({
  productId: NumericIdSchema,
});

export const UpdateProductSchema = z.object({
  productData: UpdateProductDataSchema,
  imageData: ProductImageDataSchema.array(),
});
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

export type ProductsFilterOptions = {
  distinctBrands: string[];
  distinctSizes: string[];
  distinctFilterColors: string[];
  distinctFilterMaterials: string[];
  maxPrice: number;
};

export type ProductsFilterCriteria = {
  category?: ProductCategory;
  onSale?: boolean;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Payment

const LineItemSchema = z.object({
  price_data: z.object({
    currency: z.string(),
    product_data: z.object({
      name: z.string(),
      images: z.string().array(),
    }),
    unit_amount: PriceSchema,
  }),
  quantity: ItemQuantitySchema,
});
export type StripeLineItem = z.infer<typeof LineItemSchema>;

export const StripeCheckoutDataSchema = z.object({
  orderId: NumericIdSchema,
  lineItems: LineItemSchema.array(),
});
export type StripeCheckoutData = z.infer<typeof StripeCheckoutDataSchema>;

export type StripeCheckoutSessionResponse = {
  sessionId: string;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Data grid

export type DataGridOptions = 'users' | 'orders' | 'products';

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
export type CustomResponse<T = any> = { success: boolean; message: string; data?: T };

export type ResponseWithNoData = { success: boolean; message: string };

export type ResponseWithData<T = any> = { success: boolean; message: string; data: T };

export type QueryFilterBuilder = PostgrestFilterBuilder<Database['public'], any, any[], string, any[]>;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
