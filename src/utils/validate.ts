import { DataGridOptions, QueryFilterDataGrid, QueryPageDataGrid, QuerySortDataGrid } from '@/types';
import dayjs from 'dayjs';
import {
  getInvalidFilterColumnMessage,
  getInvalidFilterOperatorMessage,
  getInvalidFilterValueMessage,
  getInvalidPageNumberMessage,
  getInvalidRowsPerPageMessage,
  getInvalidSortColumnMessage,
  getInvalidSortDirectionMessage,
} from './queryBuilder/getInvalidMessage';

const commonSuccessResponse = { success: true, message: 'Success! No validation errors caught.' };

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePage(page: QueryPageDataGrid) {
  const invalidPageNumber = Number.isNaN(page.number) || page.number < 1;
  const invalidRowsPerPage = Number.isNaN(page.rows) || page.rows < 1 || page.rows > 100;

  if (invalidPageNumber && invalidRowsPerPage) {
    return {
      success: false,
      message: `${getInvalidPageNumberMessage(page.number)} ${getInvalidRowsPerPageMessage(page.rows)}`,
    };
  }

  if (invalidPageNumber) {
    return {
      success: false,
      message: getInvalidPageNumberMessage(page.number),
    };
  }

  if (invalidRowsPerPage) {
    return {
      success: false,
      message: getInvalidRowsPerPageMessage(page.rows),
    };
  }

  return commonSuccessResponse;
}

function validateSortColumn(dataGrid: DataGridOptions, column: string) {
  const columns = {
    users: ['createdAt', 'firstName', 'lastName', 'email', 'contactNumber', 'role'],
    orders: [
      'createdAt',
      'firstName',
      'lastName',
      'contactNumber',
      'recipientFirstName',
      'recipientLastName',
      'recipientContactNumber',
      'complexOrBuilding',
      'streetAddress',
      'suburb',
      'province',
      'city',
      'postalCode',
      'orderStatus',
      'orderTotal',
    ],
  };

  const isValidSortColumn = columns[dataGrid].includes(column);

  if (!isValidSortColumn) {
    return { success: false, message: getInvalidSortColumnMessage(column) };
  }

  return commonSuccessResponse;
}

function validateSortDirection(direction: string) {
  const isValidSortDirection = ['asc', 'desc'].includes(`${direction}`);

  if (!isValidSortDirection) {
    return { success: false, message: getInvalidSortDirectionMessage(direction) };
  }

  return commonSuccessResponse;
}

function validateIdFilter(filter: QueryFilterDataGrid) {
  const isValidOperator = filter.operator === 'equals';

  if (!isValidOperator) {
    return { success: false, message: getInvalidFilterOperatorMessage(filter.operator) };
  }

  return commonSuccessResponse;
}

function validateDateFilter(filter: QueryFilterDataGrid) {
  const isValidOperator = ['is', 'not', 'after', 'onOrAfter', 'before', 'onOrBefore'].includes(`${filter.operator}`);
  const isValidValue = dayjs(filter.value).isValid();

  if (!isValidOperator) {
    return { success: false, message: getInvalidFilterOperatorMessage(filter.operator) };
  }

  if (!isValidValue) {
    return { success: false, message: getInvalidFilterValueMessage(filter.value) };
  }

  return commonSuccessResponse;
}

function validateStringFilter(filter: QueryFilterDataGrid) {
  const isValidOperator = ['contains', 'equals', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'].includes(
    `${filter.operator}`
  );

  if (!isValidOperator) {
    return { success: false, message: getInvalidFilterOperatorMessage(filter.operator) };
  }

  return commonSuccessResponse;
}

function validateEmailFilter(filter: QueryFilterDataGrid) {
  const isValidOperator = ['contains', 'equals', 'startsWith', 'endsWith'].includes(`${filter.operator}`);
  const isValidValue = validateEmail(`${filter.value}`);

  if (!isValidOperator) {
    return { success: false, message: getInvalidFilterOperatorMessage(filter.operator) };
  }

  if (!isValidValue) {
    return { success: false, message: getInvalidFilterValueMessage(filter.value) };
  }

  return commonSuccessResponse;
}

function validateIsNotValueFilter(dataGrid: DataGridOptions, filter: QueryFilterDataGrid) {
  const values = {
    users: ['owner', 'manager', 'admin', 'none'],
    orders: ['awaiting payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'],
  };
  const isValidOperator = ['is', 'not'].includes(`${filter.operator}`);
  const isValidValue = values[dataGrid].includes(`${filter.value}`);

  if (!isValidOperator) {
    return { success: false, message: getInvalidFilterOperatorMessage(filter.operator) };
  }

  if (!isValidValue) {
    return { success: false, message: getInvalidFilterValueMessage(filter.value) };
  }

  return commonSuccessResponse;
}

function validateNonnegativeNumberFilter(filter: QueryFilterDataGrid) {
  const isValidOperator = ['=', '!=', '>', '>=', '<', '<='].includes(`${filter.operator}`);
  const value = Number(filter.value);
  const isValidValue = !Number.isNaN(value) && value >= 0;

  if (!isValidOperator) {
    return { success: false, message: getInvalidFilterOperatorMessage(filter.operator) };
  }

  if (!isValidValue) {
    return { success: false, message: getInvalidFilterValueMessage(filter.value) };
  }

  return commonSuccessResponse;
}

export function validateSearchParamsForDataGridQuery(
  dataGrid: DataGridOptions,
  page: QueryPageDataGrid,
  sort: QuerySortDataGrid,
  filter: QueryFilterDataGrid
) {
  if (!validatePage(page).success) {
    const { success, message } = validatePage(page);

    return { success, message, data: null };
  }

  if (!validateSortColumn(dataGrid, sort.column).success) {
    const { success, message } = validateSortColumn(dataGrid, sort.column);

    return { success, message, data: null };
  }

  if (sort.direction && !validateSortDirection(sort.direction).success) {
    const { success, message } = validateSortDirection(sort.direction);

    return { success, message, data: null };
  }

  if (filter.column && filter.operator) {
    let success, message;

    switch (filter.column) {
      case 'userId':
      case 'orderId':
        ({ success, message } = validateIdFilter(filter));
        break;
      case 'createdAt':
        ({ success, message } = validateDateFilter(filter));
        break;
      case 'firstName':
      case 'lastName':
      case 'contactNumber':
      case 'recipientFirstName':
      case 'recipientLastName':
      case 'recipientContactNumber':
      case 'complexOrBuilding':
      case 'streetAddress':
      case 'suburb':
      case 'province':
      case 'city':
        ({ success, message } = validateStringFilter(filter));
        break;
      case 'email':
        ({ success, message } = validateEmailFilter(filter));
        break;
      case 'role':
      case 'orderStatus':
        ({ success, message } = validateIsNotValueFilter(dataGrid, filter));
        break;
      case 'orderTotal':
      case 'postalCode':
        ({ success, message } = validateNonnegativeNumberFilter(filter));
        break;
      default:
        return { success: false, message: getInvalidFilterColumnMessage(filter.column), data: null };
    }

    if (!success) {
      return { success, message, data: null };
    }
  }

  return { ...commonSuccessResponse, data: { page, sort, filter } };
}
