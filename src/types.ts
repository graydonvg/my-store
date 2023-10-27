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

export type ResponseType = { status: number; statusText: string };

export type CurrentUserType = Database['public']['Tables']['users']['Row'];

export type UserState = {
  currentUser: CurrentUserType | null;
};

export type AddNewProductFormDataType = {
  imageData: { imageUrl: string; fileName: string }[] | { uploadProgress: number; fileName: string }[];
  sizes: string[];
  category: string;
  name: string;
  description: string;
  deliveryInfo: string;
  price: number | '';
  onSale: string | null;
  salePercentage: number | '';
};
