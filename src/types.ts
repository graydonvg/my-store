export type DrawerAnchor = 'top' | 'left' | 'bottom' | 'right';

export type DrawerState = {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
};

export type CurrentUserType = {
  email: string;
  uid: string;
  displayName: string;
  photoURL: string;
};

export type UserState = {
  currentUser: CurrentUserType | null;
};
