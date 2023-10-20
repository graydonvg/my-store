export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

export type DrawerState = {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
};

export type CurrentUserType = {
  displayName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  isAdmin: boolean;
} | null;

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

export type ProductDataType = {
  imageData: { imageUrl: string; fileName: string }[];
  sizes: string[];
  category: string;
  name: string;
  description: string;
  deliveryInfo: string;
  price: number | '';
  onSale: string | null;
  salePercentage: number | '';
};
