import { Box, Divider, ListItem, Typography } from '@mui/material';
import Link from 'next/link';
import useColorPalette from '@/hooks/useColorPalette';

type Props = {
  path: string;
  label: string;
  isLastNavOption: boolean;
  underline: boolean;
};

export default function LowerNavbarOption({ path, label, isLastNavOption, underline }: Props) {
  const colorPalette = useColorPalette();
  const isSaleOption = label.toLowerCase() === 'sale';

  return (
    <ListItem
      disablePadding
      disableGutters>
      <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', paddingX: 2, paddingY: 1 }}>
        <Typography
          component="span"
          sx={{
            textTransform: 'none',
            color: isSaleOption ? colorPalette.warning.dark : colorPalette.navBar.lower.text,
            textDecoration: underline ? 'underline' : 'none',
            textDecorationColor: isSaleOption ? colorPalette.warning.dark : colorPalette.navBar.lower.text,
            textDecorationThickness: 1,
            textUnderlineOffset: 6,
            '&:hover': {
              color: isSaleOption ? colorPalette.warning.light : colorPalette.typography,
              textDecorationColor: isSaleOption ? colorPalette.warning.light : colorPalette.typography,
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
