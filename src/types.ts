import { Database, Json } from './lib/database.types';

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

export type DrawerState = {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
};

export type DrawerContentType = 'nav' | 'cart' | null;

export type ModalContentType = 'signIn' | 'signUp' | 'updateUserData' | null;

export type CustomResponseType = { success: boolean; message: string; data?: any };

export type CurrentUserType = Database['public']['Tables']['users']['Row'];

export type ProductType = Database['public']['Tables']['products']['Row'] & {
  product_image_data: Pick<Database['public']['Tables']['product_image_data']['Row'], 'file_name' | 'image_url'>[];
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

export type AddProductImageDataType = {
  image_url: string;
  file_name: string;
};

export type AddProductImageUploadProgressType = {
  file_name: string;
  progress: number;
};
