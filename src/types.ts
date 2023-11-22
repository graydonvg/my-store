import { Database } from './lib/supabase/database.types';

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

export type DrawerState = {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
};

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

export type ImageUploadProgressType = {
  file_name: string;
  progress: number;
};

export type ProductImageDataStoreType = {
  image_url: string;
  file_name: string;
  product_image_id?: string;
};

export type ProductImageDataDbType = Omit<
  Omit<Database['public']['Tables']['product_image_data']['Row'], 'created_at'>,
  'product_image_id'
>;

export type CartItemType =
  | (Omit<Omit<Database['public']['Tables']['cart']['Row'], 'user_id'>, 'product_id'> & {
      product:
        | (Pick<
            Database['public']['Tables']['products']['Row'],
            'name' | 'on_sale' | 'price' | 'sale_percentage' | 'delivery_info' | 'product_id'
          > & {
            product_image_data: Pick<Database['public']['Tables']['product_image_data']['Row'], 'image_url'>[];
          })
        | null;
    })
  | null;

export type AddCartItemDbType = Omit<Omit<Database['public']['Tables']['cart']['Row'], 'created_at'>, 'cart_item_id'>;

export type UpdateCartItemDbType = Pick<
  Database['public']['Tables']['cart']['Row'],
  'quantity' | 'cart_item_id' | 'size'
>;

export type CartState = {
  isCartOpen: {
    top: boolean;
    left: boolean;
    bottom: boolean;
    right: boolean;
  };
  cartItems: CartItemType[];
};
