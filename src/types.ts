import { Database } from './lib/supabase/database.types';

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

export type DrawerState = {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
};

export type CustomResponseType<T = undefined> = { success: boolean; message: string; data?: T };

export type CartItemType =
  | (Omit<Omit<Database['public']['Tables']['cart']['Row'], 'user_id'>, 'product_id'> & {
      product:
        | (Pick<
            Database['public']['Tables']['products']['Row'],
            'name' | 'on_sale' | 'price' | 'sale_percentage' | 'delivery_info' | 'return_info' | 'product_id' | 'sizes'
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

export type InsertProductTypeStore = {
  category: string;
  delivery_info: string;
  description: string;
  name: string;
  on_sale: string;
  price: '' | number;
  sale_percentage: '' | number;
  sizes: string[];
};

export type InsertCartItemType = Database['public']['Tables']['cart']['Insert'];

export type userPasswordType = { currentPassword: string; newPassword: string; confirmPassword: string };

export type InsertAddressType = Database['public']['Tables']['addresses']['Insert'];
