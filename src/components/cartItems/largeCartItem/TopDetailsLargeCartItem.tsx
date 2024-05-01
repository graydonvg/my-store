import { Box, Typography } from '@mui/material';
import Link from 'next/link';

type Props = {
  name: string;
  brand: string;
  productHref: string;
};

export default function TopDetailsLargeCartItem({ name, brand, productHref }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Link href={productHref}>
        <Typography
          lineHeight={1}
          component="p"
          fontWeight={600}
          fontSize={{ xs: 20, sm: 24 }}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            paddingRight: 3,
          }}>
          {name}
        </Typography>
      </Link>
      <Typography
        lineHeight={1}
        component="span"
        fontWeight={600}
        fontSize={14}
        color={(theme) => theme.palette.text.secondary}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: '1',
          WebkitBoxOrient: 'vertical',
          marginTop: '6px',
        }}>
        {brand.toUpperCase()}
      </Typography>
    </Box>
  );
}
