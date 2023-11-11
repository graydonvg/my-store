import { Database } from './lib/supabase/database.types';

export type ModalContentType = 'signIn' | 'signUp' | 'updateUserData' | null;

export type CustomResponseType<T = undefined> = { success: boolean; message: string; data?: T };

export type CurrentUserType = Database['public']['Tables']['users']['Row'];

export type ProductType = Database['public']['Tables']['products']['Row'] & {
  product_image_data: Omit<
    Omit<Database['public']['Tables']['product_image_data']['Row'], 'created_at'>,
    'product_id'
  >[];
};

export type AddProductStoreType = {
  category: string;
  delivery_info: string;
  description: string;
  name: string;
  on_sale: string;
  price: '' | number;
  sale_percentage: '' | number;
  sizes: string[];
};

export type AddProductDbType = Omit<Omit<Database['public']['Tables']['products']['Row'], 'created_at'>, 'product_id'>;

export type UpdateProductType = Omit<Database['public']['Tables']['products']['Row'], 'created_at'>;

export type ProductImageDataStoreType = {
  image_url: string;
  file_name: string;
  product_image_id?: string;
  index: number;
};

export type ProductImageDataDbType = Omit<
  Omit<Database['public']['Tables']['product_image_data']['Row'], 'created_at'>,
  'product_image_id'
>;

// export type CartItemType = {
//   product_id: string;
//   name: string;
//   image_url: string;
//   price: number;
//   sale_price: number;
//   size: string;
// };

export type CartItemType = {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  salePrice: number;
  quantity: number;
  priceByQuantity?: number;
  salePriceByQuantity?: number;
  size: string;
};
