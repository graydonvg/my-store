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
  | (Omit<Omit<Database['public']['Tables']['cart']['Row'], 'user_id'>, 'product_id'> & {
      product:
        | (Pick<
            Database['public']['Tables']['products']['Row'],
            | 'name'
            | 'on_sale'
            | 'price'
            | 'sale_percentage'
            | 'delivery_info'
            | 'return_info'
            | 'product_id'
            | 'sizes'
            | 'brand'
          > & {
            product_image_data: Pick<Database['public']['Tables']['product_image_data']['Row'], 'image_url'>[];
          })
        | null;
    })
  | null;

export type CurrentUserType = Database['public']['Tables']['users']['Row'] & {
  addresses: Database['public']['Tables']['addresses']['Row'][];
};

export type ImageUploadProgressType = {
  file_name: string;
  progress: number;
};

export type UpdateProductType = Database['public']['Tables']['products']['Update'];

export type InsertProductImageDataTypeStore = {
  image_url: string;
  file_name: string;
  product_image_id?: string;
};

export type InsertProductImageDataTypeDb = Database['public']['Tables']['product_image_data']['Insert'];

export type userPersonalInformationType = Pick<
  Database['public']['Tables']['users']['Row'],
  'first_name' | 'last_name' | 'contact_number'
>;

export type ProductType = Database['public']['Tables']['products']['Row'] & {
  product_image_data: Omit<
    Omit<Database['public']['Tables']['product_image_data']['Row'], 'created_at'>,
    'product_id'
  >[];
};

export type InsertProductTypeDb = Database['public']['Tables']['products']['Insert'];

export type InsertProductTypeStore = Omit<
  Omit<Database['public']['Tables']['products']['Insert'], 'price'>,
  'sale_percentage'
> & {
  price: '' | number;
  sale_percentage: '' | number;
};

export type InsertCartItemType = Database['public']['Tables']['cart']['Insert'];

export type userPasswordType = { currentPassword: string; newPassword: string; confirmPassword: string };

export type InsertAddressType = Database['public']['Tables']['addresses']['Insert'];

export type AddressType = Database['public']['Tables']['addresses']['Row'];

export type UpdateAddressTypeDb = Database['public']['Tables']['addresses']['Update'];

export type UpdateAddressTypeStore = Omit<Database['public']['Tables']['addresses']['Update'], 'postal_code'> & {
  postal_code: '' | number;
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

export type OrderType = Omit<Database['public']['Tables']['orders']['Row'], 'user_id'> & {
  order_items: Omit<Omit<Database['public']['Tables']['order_items']['Row'], 'order_id'>, 'user_id'>[];
};

export type InserOrderType = Database['public']['Tables']['orders']['Insert'];

export type InserOrderItemsType = Database['public']['Tables']['order_items']['Insert'];

export type OrderItemsTypeStore = Omit<
  Omit<Database['public']['Tables']['order_items']['Insert'], 'order_id'>,
  'user_id'
>;

export type CheckoutDataType = {
  selectedAddressId: string | null;
  isProcessing: boolean;
  orderItems: OrderItemsTypeStore[];
  paymentTotals: {
    cartTotal: number;
    deliveryFee: number;
    totalDiscount: number;
    orderTotal: number;
  };
  shippingDetails: string | null;
  orderId: string | null;
};

export type UpdateOrderType = { order_id: string; is_paid: boolean };
