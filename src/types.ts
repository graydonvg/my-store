import { z } from 'zod';
import { Database } from './lib/supabase/database.types';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { DetailedError } from 'tus-js-client';

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

export const NumericIdSchema = z.coerce
  .number()
  .int({ message: 'ID must be an integer' })
  .positive({ message: 'ID must be a positive number' });

export const StringIdSchema = z
  .string()
  .trim()
  .min(1, { message: 'ID cannot be empty' })
  .max(1000, { message: 'ID cannot exceed 1000 characters' });

export const PasswordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters' })
  .max(255, { message: 'Password cannot exceed 255 characters' });

export const FirstNameSchema = z
  .string()
  .trim()
  .max(50, { message: 'First name cannot exceed 50 characters' })
  .regex(/^[\p{L}\p{M}'-]+(?: [\p{L}\p{M}'-]+)*$/u, {
    message: 'First name can only contain letters, hyphens, apostrophes, and spaces',
  })
  .refine((value) => value.length >= 2, {
    message: 'First name must contain at least 2 characters',
  });

export const LastNameSchema = z
  .string()
  .trim()
  .max(50, { message: 'Last name cannot exceed 50 characters' })
  .regex(/^[\p{L}\p{M}'-]+(?: [\p{L}\p{M}'-]+)*$/u, {
    message: 'Last name can only contain letters, hyphens, apostrophes, and spaces',
  })
  .refine((value) => value.length >= 2, {
    message: 'Last name must contain at least 2 characters',
  });

export const ContactNumberSchema = z.string().regex(/^(\+27|0)[1-9][0-9]{8}$/, {
  message: 'Please enter a valid South African contact number',
});

const ComplexOrBuildingSchema = z
  .string()
  .trim()
  .max(100, { message: 'Complex or building name cannot exceed 100 characters' })
  .regex(/^[A-Za-z0-9\s,'\-\/]+$/, {
    message:
      'Complex or building name can contain letters, numbers, spaces, commas, apostrophes, hyphens, and slashes only',
  })
  .nullable();

const StreetAddressSchema = z
  .string()
  .trim()
  .max(255, { message: 'Street address cannot exceed 255 characters' })
  .regex(/^[A-Za-z0-9\s,.-]+$/, {
    message: 'Street address can contain letters, numbers, spaces, commas, periods, and hyphens only',
  })
  .refine((value) => value.length >= 3, {
    message: 'Street address must contain at least 3 characters',
  });

const SuburbSchema = z
  .string()
  .trim()
  .max(100, { message: 'Suburb name cannot exceed 100 characters' })
  .regex(/^[A-Za-z\s]+$/, {
    message: 'Suburb name can only contain letters and spaces',
  })
  .refine((value) => value.length >= 2, {
    message: 'Suburb name must contain at least 2 characters',
  });

const CitySchema = z
  .string()
  .trim()
  .max(100, { message: 'City name cannot exceed 100 characters' })
  .regex(/^[A-Za-z\s]+$/, {
    message: 'City name can only contain letters and spaces',
  })
  .refine((value) => value.length >= 2, {
    message: 'City name must contain at least 2 characters',
  });

const ProvinceSchema = z
  .string()
  .trim()
  .max(100, { message: 'Province name cannot exceed 100 characters' })
  .regex(/^[A-Za-z\s]+$/, {
    message: 'Province name can only contain letters and spaces',
  })
  .refine((value) => value.length >= 2, {
    message: 'Province name must contain at least 2 characters',
  });

const PostalCodeSchema = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.coerce.string().regex(/^\d{4}$/, { message: 'Postal code must be 4 digits' })
);
export type PostalCode = z.infer<typeof PostalCodeSchema>;

const ItemQuantitySchema = z
  .number()
  .int({ message: 'Quantity must be an integer' })
  .positive({ message: 'Quantity must be a positive number' })
  .max(10000, { message: 'Quantity cannot exceed 10000' });

const ItemSizeSchema = z
  .string()
  .min(1, { message: 'Item size cannot be empty' })
  .max(50, { message: 'Item size cannot exceed 50 characters' });

const ProductIdSchema = z
  .number()
  .int({ message: 'Product ID must be an integer' })
  .positive({ message: 'Product ID must be a positive number' })
  .max(1000000, { message: 'Product ID cannot exceed 1,000,000' });

const ProductNameSchema = z
  .string()
  .trim()
  .min(1, { message: 'Product name is required' })
  .max(255, { message: 'Product name cannot exceed 255 characters' });

const ProductImageUrlSchema = z
  .string()
  .trim()
  .url({ message: 'Invalid URL format for the image' })
  .min(1, { message: 'Image URL cannot be empty' })
  .max(255, { message: 'Image URL cannot exceed 255 characters' });

const PriceSchema = z
  .number()
  .positive({ message: 'Price must be a positive number' })
  .max(1000000, { message: 'Price cannot exceed 1,000,000' });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// User

export const UserRoleSchema = z
  .enum(['admin', 'manager', 'owner'], { message: 'Please provide a valid role' })
  .nullable();
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserRoleSelectOptionsSchema = z.enum(['none', 'admin', 'manager', 'owner'], {
  message: 'Please select a role',
});
export type UserRoleSelectOptions = z.infer<typeof UserRoleSelectOptionsSchema>;

export const UserAuthDataSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(254, 'Email cannot be longer than 254 characters'),
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
  firstName: FirstNameSchema.optional().or(z.literal('')),
  lastName: LastNameSchema.optional().or(z.literal('')),
  contactNumber: ContactNumberSchema.optional().or(z.literal('')),
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
  createdBy: string;
};

export const CreateUserSchema = UserAuthDataSchema.merge(UserPersonalInfoSchema).merge(
  z.object({ role: UserRoleSchema })
);
export type CreateUser = z.infer<typeof CreateUserSchema>;

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
  complexOrBuilding: ComplexOrBuildingSchema.or(z.literal('')),
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
  complexOrBuilding: ComplexOrBuildingSchema.or(z.literal('')),
  streetAddress: StreetAddressSchema,
  suburb: SuburbSchema,
  city: CitySchema,
  province: ProvinceSchema,
  postalCode: PostalCodeSchema,
});
export type UpdateAddress = z.infer<typeof UpdateAddressSchema>;

export type AddressStore = {
  addressId: number;
  recipientFirstName: string;
  recipientLastName: string;
  recipientContactNumber: string;
  complexOrBuilding: string | null;
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: PostalCode;
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
  complexOrBuilding: ComplexOrBuildingSchema.or(z.literal('')),
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
  deliveryFee: z
    .number()
    .nonnegative({ message: 'Delivery fee must be nonnegative' })
    .max(1000000, { message: 'Delivery fee cannot exceed 1,000,000' }),
  discountTotal: z
    .number()
    .nonnegative({ message: 'Discount total must be nonnegative' })
    .max(1000000, { message: 'Discount total cannot exceed 1,000,000' }),
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
  createdBy: string;
};

export const UpdateOrderSchema = z.object({
  orderId: NumericIdSchema,
  recipientFirstName: FirstNameSchema.optional(),
  recipientLastName: LastNameSchema.optional(),
  recipientContactNumber: ContactNumberSchema.optional(),
  complexOrBuilding: ComplexOrBuildingSchema.optional(),
  streetAddress: StreetAddressSchema.optional(),
  suburb: SuburbSchema.optional(),
  city: CitySchema.optional(),
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

export type ProductImageUploadProgress = {
  fileName: string;
  progress: number;
};

const ProductImageDataSchema = z.object({
  productImageId: NumericIdSchema.optional(),
  imageIndex: z
    .number()
    .int({ message: 'Image index must be an integer' })
    .nonnegative({ message: 'Image index cannot be negative' })
    .max(4, { message: 'Image index cannot exceed 4' }),
  fileName: z
    .string()
    .trim()
    .min(1, { message: 'File name cannot be empty' })
    .max(255, { message: 'File name cannot exceed 255 characters' }),
  imageUrl: ProductImageUrlSchema,
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
  filterColors: string[];
  filterMaterials: string[];
  createdBy: string;
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
  filterColors: string[];
  filterMaterials: string[];
};

const ProductDataSchema = z.object({
  category: ProductCategorySchema,
  name: ProductNameSchema,
  brand: z
    .string()
    .trim()
    .min(1, { message: 'Brand name is required' })
    .max(255, { message: 'Brand name cannot exceed 255 characters' })
    .trim(),
  details: z
    .string()
    .trim()
    .min(1, { message: 'Product details are required' })
    .max(1000, { message: 'Product details cannot exceed 1000 characters' })
    .trim(),
  sizes: z.array(z.string().trim()).max(5, { message: 'You can only specify up to 5 sizes' }),
  deliveryInfo: z
    .string()
    .trim()
    .min(1, { message: 'Delivery information is required' })
    .max(500, { message: 'Delivery information cannot exceed 500 characters' }),
  returnInfo: z
    .string()
    .trim()
    .min(1, { message: 'Return information is required' })
    .max(500, { message: 'Return information cannot exceed 500 characters' }),
  price: PriceSchema,
  isOnSale: z.boolean().refine((value) => typeof value === 'boolean', {
    message: 'Sale status must be true or false',
  }),
  salePercentage: z
    .number()
    .nonnegative({ message: 'Sale percentage cannot be negative' })
    .max(100, { message: 'Sale percentage cannot exceed 100' }),
  filterColors: z
    .array(z.string().trim())
    .min(1, { message: 'At least 1 filter color is required' })
    .max(10, { message: 'You can only specify up to 10 filter colors' }),
  filterMaterials: z
    .array(z.string().trim())
    .min(1, { message: 'At least 1 filter material is required' })
    .max(10, { message: 'You can only specify up to 10 filter materials' }),
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

export const DeleteProductImageSchema = z
  .object({
    productImageId: NumericIdSchema.optional(),
    fileName: z.string(),
  })
  .array();
export type DeleteProductImage = z.infer<typeof DeleteProductImageSchema>;

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
    currency: z.string().length(3, { message: 'Currency code must be a 3-letter ISO code' }),
    product_data: z.object({
      name: ProductNameSchema,
      images: ProductImageUrlSchema.array().max(1, { message: 'A maximum of 1 image is allowed per product' }),
    }),
    unit_amount: z.number().positive({ message: 'Price must be a positive number' }),
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

export type ResponseWithNoData = { success: boolean; message: string };

export type ResponseWithData<T = any> = { success: boolean; message: string; data: T };

export type QueryFilterBuilder = PostgrestFilterBuilder<Database['public'], any, any[], string, any[]>;

export type UploadResult =
  | { error: Error | DetailedError | string; fileName: string }
  | { imageUrl: string | null; fileName: string };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
