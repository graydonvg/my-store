'use client';

import {
  Box,
  Divider,
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

import CustomNoRowsOverlay from '@/components/dataGrid/CustomNoRowsOverlay';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CardTitle from './CardTitle';
import { AdminDashboardCard } from './AdminDashboradCard';
import { BORDER_RADIUS } from '@/constants';

const headCellLabels = ['#', 'Products', 'Units'];

type Props = {
  bestSellers:
    | {
        totalQuantitySold: number;
        productId: number;
        name: string;
        category: string;
        productImageData: {
          imageUrl: string;
        }[];
      }[]
    | null;
};

export default function BestSellers({ bestSellers }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  function navigateToProductPage(category: string, name: string, productId: number) {
    router.push(`/products/${category.toLowerCase()}/${name.toLowerCase().split(' ').join('-')}/${productId}`);
  }

  return (
    <AdminDashboardCard>
      <Box sx={{ containerType: 'inline-size' }}>
        <Box sx={{ padding: 2 }}>
          <CardTitle>Best Sellers</CardTitle>
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
              {bestSellers
                ? bestSellers.map((bestSeller, index) => (
                    <TableRow
                      key={bestSeller?.productId}
                      onClick={() => navigateToProductPage(bestSeller.category, bestSeller.name, bestSeller.productId)}
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
                            src={bestSeller.productImageData[0].imageUrl}
                            alt={`Image for ${bestSeller.name}`}
                            fill
                            style={{ objectFit: 'cover', borderRadius: BORDER_RADIUS }}
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
                          {bestSeller.name}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          '@container (max-width: 335px)': {
                            paddingX: 1,
                          },
                        }}>
                        {bestSeller.totalQuantitySold}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
          {!bestSellers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: 2 }}>
              <CustomNoRowsOverlay text="No data received" />
            </Box>
          ) : null}
        </TableContainer>
      </Box>
    </AdminDashboardCard>
  );
}
