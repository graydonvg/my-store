import { UsersSortableColumns } from '@/types';

export function validatePage(page: { number: number; rows: number }) {
  const { number, rows } = page;

  if (typeof number !== 'number' || Number.isNaN(number)) {
    return {
      success: false,
      message: 'Page number must be a valid number.',
    };
  }

  if (typeof rows !== 'number' || Number.isNaN(rows)) {
    return {
      success: false,
      message: 'Rows per page must be a valid number.',
    };
  }

  if (rows <= 0 || number <= 0) {
    return {
      success: false,
      message: 'Please provide a number greater than 0.',
    };
  }

  if (rows > 100) {
    return {
      success: false,
      message: 'Max 100 rows per page.',
    };
  }

  return {
    success: true,
    message: 'Success!',
  };
}

export function validateSortColumn(column: any, setSortColumnInvalid: () => void) {
  function isValidSortColumn(col: any): col is UsersSortableColumns {
    return ['createdAt', 'firstName', 'lastName', 'email', 'contactNumber', 'role'].includes(col);
  }

  if (!isValidSortColumn(column)) {
    setSortColumnInvalid();
  }

  return null;
}

export function validateSortDirection(direction: any, setSortDirectionInvalid: () => void) {
  function isValidSortDirection(col: any): col is 'asc' | 'desc' {
    return ['asc', 'desc'].includes(col);
  }

  if (!isValidSortDirection(direction)) {
    setSortDirectionInvalid();
  }

  return null;
}
