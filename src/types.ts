export type DrawerAnchor = 'top' | 'left' | 'bottom' | 'right';

export type DrawerState = {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
};

export type CurrentUserType = {
  displayName: string;
  email: string;
} | null;

export type UserState = {
  currentUser: CurrentUserType | null;
};
