import { Box, Divider, ListItem, Typography } from '@mui/material';
import Link from 'next/link';

type Props = {
  path: string;
  label: string;
  isLastNavOption: boolean;
  underline: boolean;
};

export default function LowerNavbarOption({ path, label, isLastNavOption, underline }: Props) {
  const isSaleOption = label.toLowerCase() === 'sale';

  return (
    <ListItem
      disablePadding
      disableGutters>
      <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', paddingX: 2, paddingY: 1 }}>
        <Typography
          component="span"
          sx={(theme) => ({
            textTransform: 'none',
            color: isSaleOption ? theme.palette.custom.warning.dark : theme.palette.custom.navBar.lower.text,
            textDecoration: underline ? 'underline' : 'none',
            textDecorationColor: isSaleOption
              ? theme.palette.custom.warning.dark
              : theme.palette.custom.navBar.lower.text,
            textDecorationThickness: 1,
            textUnderlineOffset: 6,
            '&:hover': {
              color: isSaleOption ? theme.palette.custom.warning.light : theme.palette.custom.typography,
              textDecorationColor: isSaleOption ? theme.palette.custom.warning.light : theme.palette.custom.typography,
            },
          })}>
          <Link href={path}>{label}</Link>
        </Typography>
      </Box>
      {!isLastNavOption ? (
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
        />
      ) : null}
    </ListItem>
  );
}
