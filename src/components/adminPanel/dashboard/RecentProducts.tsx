'use client';

import {
  Box,
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
import CardTitle from './CardTitle';
import CustomNoRowsOverlay from '@/components/dataGrid/CustomNoRowsOverlay';
import Image from 'next/image';
import Link from 'next/link';
import MuiLink from '@/components/ui/MuiLink';
import { ArrowForward } from '@mui/icons-material';
import { calculateRoundedDiscountedPrice } from '@/utils/calculate';
import { formatCurrency } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { ProductCategory } from '@/types';

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
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
      <TableContainer>
        <Table
          size={isBelowSmall ? 'small' : 'medium'}
          stickyHeader>
          <TableHead>
            <TableRow>
              {headCellLabels.map((label) => (
                <TableCell
                  key={label}
                  sx={{
                    backgroundColor: theme.palette.custom.dataGrid.header,
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
                    <TableCell width={1}>{index + 1}</TableCell>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                          style={{ objectFit: 'cover', borderRadius: CONSTANTS.BORDER_RADIUS }}
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
                    <TableCell>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: 2 }}>
            <CustomNoRowsOverlay text="No data received" />
          </Box>
        ) : null}
      </TableContainer>
    </>
  );
}