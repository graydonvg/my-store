import dayjs from 'dayjs';
import {
  DataGridFilter,
  AdminUsersDataGridFilterableColumns,
  AdminUsersDataGridQueryFilterBuilder,
  DataGridInvalidFlags,
} from '@/types';

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
  if (filter.operator === '=') {
    // Cannot use eq because of timestamptz
    // To filter by specific date (e.g. 2024/01/02) use previous date < given date < next date

    const givenDate = new Date(filter.value);

    // Adding a day
    const nextDay = new Date(givenDate);
    nextDay.setDate(givenDate.getDate() + 1);
    const formattedNextDay = dayjs(nextDay).format('YYYY/MM/DD');

    // Subtracting a day
    const previousDay = new Date(givenDate);
    previousDay.setDate(givenDate.getDate() - 1);
    const formattedPreviousDay = dayjs(previousDay).format('YYYY/MM/DD');

    return usersQuery.gt(filter.column!, formattedPreviousDay).lt(filter.column!, formattedNextDay);
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
  if (filter.operator === 'contains') {
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
