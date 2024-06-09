import { Box, Divider, ListItem, Typography } from '@mui/material';
import Link from 'next/link';

type Props = {
  path: string;
  label: string;
  showDividerRight: boolean;
  underline: boolean;
};

export default function LowerNavbarOption({ path, label, showDividerRight, underline }: Props) {
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
            color: theme.palette.custom.navbar.lower.text,
            textDecoration: underline ? 'underline' : 'none',
            textDecorationColor: theme.palette.custom.navbar.lower.text,
            textDecorationThickness: 1,
            textUnderlineOffset: 6,
            ...(isSaleOption && {
              color: theme.palette.secondary.main,
              fontWeight: 'medium',
              textDecorationColor: theme.palette.secondary.main,
            }),
            '&:hover': {
              color: theme.palette.text.primary,
              textDecorationColor: theme.palette.text.primary,
              ...(isSaleOption && {
                color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.dark,
                textDecorationColor: theme.palette.secondary.dark,
              }),
            },
          })}>
          <Link href={path}>{label}</Link>
        </Typography>
      </Box>
      {showDividerRight ? (
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{
            borderColor: (theme) => theme.palette.custom.navbar.divider,
          }}
        />
      ) : null}
    </ListItem>
  );
}
