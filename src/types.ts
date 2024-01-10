import { ChangeEvent } from 'react';
import { Database } from './lib/supabase/database.types';

export type ContainedButtonButtonBackgroundColorType = 'blue' | 'red';

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

export type DrawerState = {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
};

export type CustomResponseType<T = undefined> = { success: boolean; message: string; data?: T };

export type PersonalInformationType = {
  name: string;
  surname: string;
  contactNumber: string;
};

export type AccountType = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type CartItemType =
  | (Omit<Omit<Database['public']['Tables']['cart']['Row'], 'userId'>, 'productId'> & {
      product:
        | (Omit<Omit<Database['public']['Tables']['products']['Row'], 'createdAt'>, 'details'> & {
            productImageData: Pick<Database['public']['Tables']['productImageData']['Row'], 'imageUrl'>[];
          })
        | null;
    })
  | null;

export type UserDataType = Database['public']['Tables']['users']['Row'] & {
  addresses: Database['public']['Tables']['addresses']['Row'][];
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
};

export type InsertProductImageDataTypeDb = Database['public']['Tables']['productImageData']['Insert'];

export type userPersonalInformationType = Pick<
  Database['public']['Tables']['users']['Row'],
  'firstName' | 'lastName' | 'contactNumber'
>;

export type ProductType = Database['public']['Tables']['products']['Row'] & {
  productImageData: Omit<Omit<Database['public']['Tables']['productImageData']['Row'], 'createdAt'>, 'productId'>[];
};

export type InsertProductTypeDb = Database['public']['Tables']['products']['Insert'];

export type InsertProductTypeStore = Omit<
  Omit<Database['public']['Tables']['products']['Insert'], 'price'>,
  'salePercentage'
> & {
  price: '' | number;
  salePercentage: '' | number;
};

export type InsertCartItemType = Database['public']['Tables']['cart']['Insert'];

export type userPasswordType = { currentPassword: string; newPassword: string; confirmPassword: string };

export type InsertAddressType = Database['public']['Tables']['addresses']['Insert'];

export type AddressType = Database['public']['Tables']['addresses']['Row'];

export type UpdateAddressTypeDb = Database['public']['Tables']['addresses']['Update'];

export type UpdateAddressTypeStore = Omit<Database['public']['Tables']['addresses']['Update'], 'postalCode'> & {
  postalCode: '' | number;
};

export type AccountTextFieldData = {
  id: string;
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDownFunction: () => void;
};

export type OrderType = {
  createdAt: string;
  orderId: string;
  cartTotal: number;
  discountTotal: number;
  deliveryFee: number;
  orderTotal: number;
  isPaid: boolean;
  shippingDetails: string;
  orderItems: {
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
      }[];
    } | null;
  }[];
};

export type InserOrderType = Database['public']['Tables']['orders']['Insert'];

export type InserOrderItemsType = Database['public']['Tables']['orderItems']['Insert'];

export type OrderItemsTypeStore = Omit<Omit<Database['public']['Tables']['orderItems']['Insert'], 'orderId'>, 'userId'>;

export type CheckoutDataType = {
  selectedAddressId: string | null;
  isProcessing: boolean;
  orderItems: OrderItemsTypeStore[];
  paymentTotals: {
    cartTotal: number;
    deliveryFee: number;
    discountTotal: number;
    orderTotal: number;
  };
  shippingDetails: string | null;
  orderId: string | null;
  userId: string | null;
};

export type UpdateOrderType = { orderId: string; isPaid: boolean };

export type DeleteOrderType = { orderId: string };
