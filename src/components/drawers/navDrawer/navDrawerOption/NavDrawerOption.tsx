'use client';

import { ListItem, Divider } from '@mui/material';
import NavDrawerOptionButtonNoLink from './NavDrawerOptionButtonNoLink';
import NavDrawerOptionButtonWithLink from './NavDrawerOptionButtonWithLink';

type Props = {
  onClick?: () => void;
  path?: string;
  label: string;
  bodyTextColor: string;
};

export default function NavDrawerOption({ onClick, path, label }: Props) {
  return (
    <>
      <ListItem
        sx={{ height: '56px' }}
        disablePadding
        onClick={onClick}>
        {!!path ? (
          <NavDrawerOptionButtonWithLink
            label={label}
            path={path!}
          />
        ) : null}
        {!path ? (
          <NavDrawerOptionButtonNoLink
            label={label}
            path={path!}
          />
        ) : null}
      </ListItem>
      <Divider />
    </>
  );
}
