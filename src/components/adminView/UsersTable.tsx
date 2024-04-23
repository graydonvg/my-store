'use client';

import {
  Box,
  SortDirection,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MuiLink from '../ui/MuiLink';
import { AdminUserDataType } from '@/types';
import { visuallyHidden } from '@mui/utils';
import { useRouter, useSearchParams } from 'next/navigation';

const sortableHeadCells = [
  {
    id: 'joined',
    label: 'Joined',
  },
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'role',
    label: 'Role',
  },
];

type Props = {
  users: AdminUserDataType[] | null;
};

export default function UsersTable({ users }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const newSearchParams = new URLSearchParams(searchParams.toString());
  const sortBy = searchParams.get('sort_by') ?? 'date';
  const sortDirection = (searchParams.get('sort') as SortDirection | undefined) ?? 'desc';

  function sortRowsBy(cellId: string) {
    if (cellId === sortBy) {
      const newSortDirection = sortDirection && sortDirection === 'asc' ? 'desc' : 'asc';

      newSearchParams.set('sort', `${newSortDirection}`);
    } else {
      newSearchParams.set('sort_by', `${cellId}`);
      newSearchParams.set('sort', 'desc');
    }

    router.push(`?${newSearchParams}`, { scroll: false });
  }

  return (
    <TableContainer
      sx={{ maxHeight: { xs: 'calc(100vh - 120px)', sm: 'calc(100vh - 152px)', md: 'calc(100vh - 168px)' } }}>
      <Table
        size={isBelowSmall ? 'small' : 'medium'}
        stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                backgroundColor: theme.palette.custom.table.header,
              }}>
              ID
            </TableCell>
            {sortableHeadCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                sortDirection={sortBy === headCell.id ? sortDirection : false}
                sx={{
                  backgroundColor: theme.palette.custom.table.header,
                }}>
                <TableSortLabel
                  active={sortBy === headCell.id}
                  direction={sortBy === headCell.id && sortDirection ? sortDirection : 'desc'}
                  onClick={() => sortRowsBy(headCell.id)}>
                  {headCell.label}
                  {sortBy === headCell.id ? (
                    <Box
                      component="span"
                      sx={visuallyHidden}>
                      {sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user?.userId}>
              <TableCell>
                <MuiLink>{user?.userId}</MuiLink>
              </TableCell>
              <TableCell>{user?.createdAt.split('T')[0]}</TableCell>
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.admin[0] && user.admin[0].userId ? 'Admin' : 'Customer'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
