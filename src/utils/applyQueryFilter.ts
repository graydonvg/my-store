import dayjs from 'dayjs';
import {
  DataGridFilter,
  AdminUsersDataGridFilterableColumns,
  AdminUsersDataGridQueryFilterBuilder,
  DataGridInvalidFlags,
} from '@/types';
import { validateEmail } from './validation';

type FilterFunctionParams = {
  usersQuery: AdminUsersDataGridQueryFilterBuilder;
  filter: DataGridFilter<AdminUsersDataGridFilterableColumns>;
  setInvalidFlags: (options: DataGridInvalidFlags) => void;
};

function applyUserIdFilter({ usersQuery, filter, setInvalidFlags }: FilterFunctionParams) {
  if (filter.operator === 'equals') {
    return usersQuery.eq(filter.column!, filter.value);
  } else {
    setInvalidFlags({ filterOperator: true });
    return usersQuery;
  }
}

function applyCreatedAtFilter({ usersQuery, filter, setInvalidFlags }: FilterFunctionParams) {
  const isValidDate = dayjs(filter.value).isValid();

  if (!isValidDate) {
    setInvalidFlags({ filterValue: true });
    return usersQuery;
  } else if (filter.operator === '=') {
    // Cannot use eq because of timestamptz
    // To filter by specific date (e.g. 2024/01/02) use start of day < given date < end of day
    const givenDate = dayjs(filter.value);
    const startOfDay = givenDate.startOf('day').format('YYYY/MM/DD HH:mm:ss');
    const endOfDay = givenDate.endOf('day').format('YYYY/MM/DD HH:mm:ss');

    return usersQuery.gt(filter.column!, startOfDay).lt(filter.column!, endOfDay);
  } else if (filter.operator === '!=') {
    return usersQuery.neq(filter.column!, filter.value);
  } else if (filter.operator === '>') {
    return usersQuery.gt(filter.column!, filter.value);
  } else if (filter.operator === '>=') {
    return usersQuery.gte(filter.column!, filter.value);
  } else if (filter.operator === '<') {
    return usersQuery.lt(filter.column!, filter.value);
  } else if (filter.operator === '<=') {
    return usersQuery.lte(filter.column!, filter.value);
  } else {
    setInvalidFlags({ filterOperator: true });
    return usersQuery;
  }
}

function applyNameOrContactNumberFilter({ usersQuery, filter, setInvalidFlags }: FilterFunctionParams) {
  if (filter.operator === 'contains') {
    return usersQuery.ilike(filter.column!, `%${filter.value}%`);
  } else if (filter.operator === 'equals') {
    return usersQuery.eq(filter.column!, filter.value);
  } else if (filter.operator === 'startsWith') {
    return usersQuery.like(filter.column!, `${filter.value}%`);
  } else if (filter.operator === 'endsWith') {
    return usersQuery.like(filter.column!, `%${filter.value}`);
  } else if (filter.operator === 'isEmpty') {
    return usersQuery.or(`${filter.column!}.is.null, ${filter.column!}.eq.""`);
  } else if (filter.operator === 'isNotEmpty') {
    return usersQuery.not(filter.column!, 'is', null).not(filter.column!, 'eq', '');
  } else {
    setInvalidFlags({ filterOperator: true });
    return usersQuery;
  }
}

function applyEmailFilter({ usersQuery, filter, setInvalidFlags }: FilterFunctionParams) {
  const isValidEmail = validateEmail(filter.value);

  if (!isValidEmail) {
    setInvalidFlags({ filterValue: true });
    return usersQuery;
  } else if (filter.operator === 'contains') {
    return usersQuery.ilike(filter.column!, `%${filter.value}%`);
  } else if (filter.operator === 'equals') {
    return usersQuery.eq(filter.column!, filter.value);
  } else if (filter.operator === 'startsWith') {
    return usersQuery.ilike(filter.column!, `${filter.value}%`);
  } else if (filter.operator === 'endsWith') {
    return usersQuery.ilike(filter.column!, `%${filter.value}`);
  } else {
    setInvalidFlags({ filterOperator: true });
    return usersQuery;
  }
}

function applyRoleFilter({ usersQuery, filter, setInvalidFlags }: FilterFunctionParams) {
  let column = 'userRoles.role';

  if (filter.operator === 'is') {
    if (filter.value === 'null') {
      return usersQuery.is(column, null);
    } else {
      return usersQuery.eq(column, filter.value);
    }
  } else if (filter.operator === 'not') {
    if (filter.value === 'null') {
      return usersQuery.not(column, 'is', null);
    } else {
      return usersQuery.neq(column, filter.value);
    }
  } else {
    setInvalidFlags({ filterOperator: true });
    return usersQuery;
  }
}

export function applyFilterForUsersTable(
  usersQuery: AdminUsersDataGridQueryFilterBuilder,
  filter: DataGridFilter<AdminUsersDataGridFilterableColumns>,
  setInvalidFlags: (options: DataGridInvalidFlags) => void
) {
  switch (filter.column) {
    case 'userId':
      return applyUserIdFilter({ usersQuery, filter, setInvalidFlags });
    case 'createdAt':
      return applyCreatedAtFilter({ usersQuery, filter, setInvalidFlags });
    case 'firstName':
    case 'lastName':
    case 'contactNumber':
      return applyNameOrContactNumberFilter({ usersQuery, filter, setInvalidFlags });
    case 'email':
      return applyEmailFilter({ usersQuery, filter, setInvalidFlags });
    case 'role':
      return applyRoleFilter({ usersQuery, filter, setInvalidFlags });
    default:
      setInvalidFlags({ filterColumn: true });
      return usersQuery;
  }
}
