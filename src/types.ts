export type DrawerAnchor = 'left' | 'right';

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
