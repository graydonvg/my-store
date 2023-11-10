import { Database } from './lib/database.types';

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

export type DrawerState = {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
};

export type DrawerContentType = 'nav' | 'cart' | null;

export type ModalContentType = 'signIn' | 'signUp' | 'updateUserData' | null;

export type CustomResponseType<T = undefined> = { success: boolean; message: string; data?: T };

export type CurrentUserType = Database['public']['Tables']['users']['Row'];

export type ProductImageDataDbType = Omit<
  Omit<Database['public']['Tables']['product_image_data']['Row'], 'created_at'>,
  'product_image_id'
>;

export type ProductType = Database['public']['Tables']['products']['Row'] & {
  product_image_data: ProductImageDataDbType[];
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

export type AddProductImageUploadProgressType = {
  file_name: string;
  progress: number;
};
