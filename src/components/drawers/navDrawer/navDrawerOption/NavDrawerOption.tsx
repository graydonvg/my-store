'use client';

import { ListItem, Divider } from '@mui/material';
import ButtonNoLinkNavDrawerOption from './ButtonNoLinkNavDrawerOption';
import ButtonWithLinkNavDrawerOption from './ButtonWithLinkNavDrawerOption';

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
          <ButtonWithLinkNavDrawerOption
            label={label}
            path={path!}
          />
        ) : null}
        {!path ? (
          <ButtonNoLinkNavDrawerOption
            label={label}
            path={path!}
          />
        ) : null}
      </ListItem>
      <Divider />
    </>
  );
}
