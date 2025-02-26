import { OrderData } from '@/types';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import OutlinedButton from '../ui/buttons/OutlinedButton';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { calculatePagination } from '@/utils/calculations';

type Props = {
  orders: OrderData[];
  pageNumber: number;
  maxOrdersPerPage: number;
  totalRowCount: number;
};

export default function PaginationButtons({ orders, pageNumber, maxOrdersPerPage, totalRowCount }: Props) {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { isEndOfData, lastPageNumber } = calculatePagination(
    orders,
    { number: pageNumber, rows: maxOrdersPerPage },
    totalRowCount
  );
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: { xs: 'center', sm: 'end' },
          alignItems: 'center',
          width: '100%',
        }}>
        {pageNumber > 1 ? (
          <Link
            href={`/orders?page=${pageNumber - 1}`}
            style={{ width: isBelowSmall ? '100%' : 'auto' }}>
            <OutlinedButton
              label="Prev"
              aria-label="Previous page"
              disabled={pageNumber < 2}
              sxStyles={{ minHeight: '40px', width: { xs: '100%', sm: 136 } }}
              startIcon={<ChevronLeft />}
            />
          </Link>
        ) : null}
        <Box
          component="ul"
          sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
          {Array.from(Array(lastPageNumber)).map((_, index) => (
            <Box
              component="li"
              aria-label={`page ${index + 1}`}
              key={index}
              sx={{
                fontSize: 24,
                color: theme.palette.text.secondary,
                ...(pageNumber === index + 1 && {
                  fontSize: 28,
                  color: theme.palette.text.primary,
                  fontWeight: 'bold',
                  lineHeight: '24px',
                }),
              }}>
              <Link href={`/orders?page=${index + 1}`}>{index + 1}</Link>
            </Box>
          ))}
        </Box>
        {!isEndOfData ? (
          <Link
            href={`/orders?page=${pageNumber + 1}`}
            style={{ width: isBelowSmall ? '100%' : 'auto' }}>
            <OutlinedButton
              label="Next"
              aria-label="Next page"
              disabled={isEndOfData}
              sxStyles={{ minHeight: '40px', width: { xs: '100%', sm: 136 } }}
              endIcon={<ChevronRight />}
            />
          </Link>
        ) : null}
      </Box>
    </Box>
  );
}
