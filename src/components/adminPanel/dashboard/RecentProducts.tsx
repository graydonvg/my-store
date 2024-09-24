'use client';

import {
  Box,
  darken,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CONSTANTS } from '@/constants';
import CustomNoRowsOverlay from '@/components/dataGrid/CustomNoRowsOverlay';
import Image from 'next/image';
import Link from 'next/link';
import MuiLink from '@/components/ui/MuiLink';
import { ArrowForward } from '@mui/icons-material';
import { calculateRoundedDiscountedPrice } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatting';
import { useRouter } from 'next/navigation';
import { ProductCategory } from '@/types';
import CardTitle from './CardTitle';

const headCellLabels = ['#', 'Products', 'Price'];

type Props = {
  recentProducts:
    | {
        productId: number;
        name: string;
        category: ProductCategory;
        price: number;
        isOnSale: boolean;
        salePercentage: number;
        productImageData: {
          imageUrl: string;
        }[];
      }[]
    | null;
};

export default function RecentProducts({ recentProducts }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  function navigateToProductPage(category: string, name: string, productId: number) {
    router.push(`/products/${category.toLowerCase()}/${name.toLowerCase().split(' ').join('-')}/${productId}`);
  }

  return (
    <Paper
      sx={{
        borderRadius: CONSTANTS.BORDER_RADIUS,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? darken(theme.palette.grey[900], 0.3) : theme.palette.background.paper,
        containerType: 'inline-size',
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 2,
        }}>
        <CardTitle>Recent Products</CardTitle>
        <Link href="/admin/products">
          <MuiLink>
            View All
            <ArrowForward
              fontSize="small"
              sx={{ marginLeft: 1 }}
            />
          </MuiLink>
        </Link>
      </Box>
      <Divider />
      <TableContainer sx={{ padding: 2 }}>
        <Table
          size={isBelowSmall ? 'small' : 'medium'}
          stickyHeader>
          <TableHead>
            <TableRow>
              {headCellLabels.map((label) => (
                <TableCell
                  key={label}
                  sx={{
                    backgroundColor: 'inherit',
                    '@container (max-width: 335px)': {
                      paddingX: 1,
                    },
                  }}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recentProducts
              ? recentProducts.map((product, index) => (
                  <TableRow
                    key={index}
                    onClick={() => navigateToProductPage(product.category, product.name, product.productId)}
                    hover
                    sx={{ cursor: 'pointer' }}>
                    <TableCell
                      width={1}
                      sx={{
                        '@container (max-width: 335px)': {
                          paddingX: 1,
                        },
                      }}>
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        '@container (max-width: 335px)': {
                          paddingX: 1,
                        },
                      }}>
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          flexShrink: 0,
                          height: 50,
                          width: 50,
                        }}>
                        <Image
                          src={product.productImageData[0].imageUrl}
                          alt={`Image for ${product.name}`}
                          fill
                          style={{
                            objectFit: 'cover',
                            borderRadius: CONSTANTS.BORDER_RADIUS,
                          }}
                          sizes="50px"
                        />
                      </Box>
                      <Typography
                        sx={{
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                        }}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        '@container (max-width: 335px)': {
                          paddingX: 1,
                        },
                      }}>
                      {product.isOnSale
                        ? formatCurrency(calculateRoundedDiscountedPrice(product.price, product.salePercentage))
                        : formatCurrency(product.price)}
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
        {!recentProducts ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              paddingTop: 2,
            }}>
            <CustomNoRowsOverlay text="No data received" />
          </Box>
        ) : null}
      </TableContainer>
    </Paper>
  );
}
