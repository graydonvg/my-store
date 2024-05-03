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
            color: isSaleOption ? theme.palette.secondary.main : theme.palette.custom.navbar.lower.text,
            textDecoration: underline ? 'underline' : 'none',
            textDecorationColor: isSaleOption ? theme.palette.secondary.main : theme.palette.custom.navbar.lower.text,
            textDecorationThickness: 1,
            textUnderlineOffset: 6,
            '&:hover': {
              color: isSaleOption ? saleOptionHoverColor : theme.palette.text.primary,
              textDecorationColor: isSaleOption ? theme.palette.secondary.dark : theme.palette.text.primary,
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
