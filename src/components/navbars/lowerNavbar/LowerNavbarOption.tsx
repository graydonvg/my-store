import { Box, Divider, ListItem, Typography, useTheme } from '@mui/material';
import Link from 'next/link';

type Props = {
  path: string;
  label: string;
  isLastNavOption: boolean;
  underline: boolean;
};

export default function LowerNavbarOption({ path, label, isLastNavOption, underline }: Props) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isSaleOption = label.toLowerCase() === 'sale';
  const saleOptionHoverColor = darkMode ? theme.palette.secondary.light : theme.palette.secondary.dark;

  return (
    <ListItem
      disablePadding
      disableGutters>
      <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', paddingX: 2, paddingY: 1 }}>
        <Typography
          component="span"
          sx={{
            textTransform: 'none',
            color: theme.palette.custom.navbar.lower.text,
            textDecoration: underline ? 'underline' : 'none',
            textDecorationColor: theme.palette.custom.navbar.lower.text,
            textDecorationThickness: 1,
            textUnderlineOffset: 6,
            ...(isSaleOption && {
              color: theme.palette.secondary.main,
              textDecorationColor: theme.palette.secondary.main,
            }),
            '&:hover': {
              color: theme.palette.text.primary,
              textDecorationColor: theme.palette.text.primary,
              ...(isSaleOption && {
                color: saleOptionHoverColor,
                textDecorationColor: theme.palette.secondary.dark,
              }),
            },
          }}>
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
