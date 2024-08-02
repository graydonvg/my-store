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
import { BestSellersType } from '@/types';
import { CONSTANTS } from '@/constants';
import CardTitle from './CardTitle';
import CustomNoRowsOverlay from '@/components/dataGrid/CustomNoRowsOverlay';
import Image from 'next/image';

const headCellLabels = ['#', 'Products', 'Units Sold'];

type Props = {
  bestSellers: BestSellersType[] | null;
};

export default function BestSellersV2({ bestSellers }: Props) {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <CardTitle>Best Sellers</CardTitle>
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
            {bestSellers
              ? bestSellers.map((bestSeller, index) => (
                  <TableRow key={bestSeller?.productId}>
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
                          src={bestSeller.productImageData[0].imageUrl}
                          alt={`Image for ${bestSeller.name}`}
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
                        {bestSeller.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{bestSeller.totalQuantitySold}</TableCell>
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
    </>
  );
}
