import { ChangeEvent } from 'react';
import { Database } from './lib/supabase/database.types';

export type ContainedButtonButtonBackgroundColorType = 'primary' | 'warning';

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

export type DrawerState = {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
};

export type CustomResponseType<T = undefined> = { success: boolean; message: string; data?: T };

export type PersonalInformationType = {
  firstName: string;
  lastName: string;
  contactNumber: string;
};

export type AccountType = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type CartItemType = {
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

export type UserDataType = {
  contactNumber: string | null;
  email: string;
  firstName: string | null;
  isAdmin: boolean;
  lastName: string | null;
  userId: string;
  addresses: AddressType[];
};

export type ImageUploadProgressType = {
  fileName: string;
  progress: number;
};

export type UpdateProductType = Database['public']['Tables']['products']['Update'];

export type InsertProductImageDataTypeStore = {
  imageUrl: string;
  fileName: string;
  productImageId?: string;
  index: number;
};

export type InsertProductImageDataTypeDb = Database['public']['Tables']['productImageData']['Insert'];

export type userPersonalInformationType = {
  contactNumber: string | null;
  firstName: string | null;
  lastName: string | null;
};

export type ProductType = {
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

export type InsertProductTypeDb = Database['public']['Tables']['products']['Insert'];

export type InsertProductTypeStore = {
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

export type InsertCartItemType = Database['public']['Tables']['cart']['Insert'];

export type userPasswordType = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type InsertAddressType = Database['public']['Tables']['addresses']['Insert'];

export type AddressType = Database['public']['Tables']['addresses']['Row'];

export type UpdateAddressTypeDb = Database['public']['Tables']['addresses']['Update'];

export type UpdateAddressTypeStore = {
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

export type AccountTextFieldDataType = {
  id: string;
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDownFunction: () => void;
};

export type ShippingDetailsType = {
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

export type OrderItemType = {
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

export type OrderType = {
  createdAt: string;
  orderId: string;
  cartTotal: number;
  discountTotal: number;
  deliveryFee: number;
  orderTotal: number;
  isPaid: boolean;
  shippingDetails: ShippingDetailsType[];
  orderItems: OrderItemType[];
};

export type AddOrderType = {
  orderDetails: {
    cartTotal: number;
    deliveryFee: number;
    discountTotal: number;
    isPaid: boolean;
    orderTotal: number;
  };
  orderItems: { pricePaid: number; productId: string; quantity: number; size: string }[];
  shippingDetails: ShippingDetailsType;
};

export type CheckoutDataType = {
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
  shippingDetails: ShippingDetailsType | null;
  orderId: string | null;
  userId: string | null;
};

export type UpdateOrderType = {
  orderId: string;
  isPaid: boolean;
};

export type UserAuthType = {
  email: string;
  password: string;
};

export type UpdateCartItemSizeType = {
  cartItemId: string;
  size: string;
};

export type UpdateCartItemQuantityType = {
  cartItemId: string;
  quantity: number;
};

export type AddOrderResponseType = {
  orderId: string;
};

export type AddProductResponseType = {
  productId: string;
};

export type StripeResponseType = {
  sessionId: string;
};
