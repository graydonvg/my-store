import { CustomResponse } from '@/types';

type ResponseData = { pageNumber: number; rowsPerPage: number };

export function validatePage(page: {
  number: number;
  rows: number;
}): CustomResponse<ResponseData> & { errorTarget: 'pageNumber' | 'rowsPerPage' | null } {
  const { number: pageNumber, rows: rowsPerPage } = page;

  if (typeof pageNumber !== 'number' || Number.isNaN(pageNumber)) {
    return {
      success: false,
      errorTarget: 'pageNumber',
      message: 'Page number must be a valid number.',
      data: { pageNumber: 1, rowsPerPage },
    };
  }

  if (typeof rowsPerPage !== 'number' || Number.isNaN(rowsPerPage)) {
    return {
      success: false,
      errorTarget: 'rowsPerPage',
      message: 'Rows per page must be a valid number.',
      data: { pageNumber, rowsPerPage: 5 },
    };
  }

  if (pageNumber < 1) {
    return {
      success: false,
      errorTarget: 'pageNumber',
      message: 'Page number must be greater than zero.',
      data: { pageNumber: 1, rowsPerPage },
    };
  }

  if (rowsPerPage <= 0) {
    return {
      success: false,
      errorTarget: 'rowsPerPage',
      message: 'Rows per page must be greater than zero.',
      data: { pageNumber, rowsPerPage: 5 },
    };
  }

  if (rowsPerPage > 100) {
    return {
      success: false,
      errorTarget: 'rowsPerPage',
      message: 'Max 100 rows per page.',
      data: { pageNumber, rowsPerPage: 100 },
    };
  }

  return {
    success: true,
    errorTarget: null,
    message: 'Success!',
    data: { pageNumber, rowsPerPage },
  };
}
