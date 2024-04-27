import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import dayjs from 'dayjs';
import { Database } from '@/lib/supabase/database.types';
import { TableFilter, UsersFilterableColumns } from '@/types';

type FilterFunctionParams = {
  usersQuery: PostgrestFilterBuilder<Database['public'], any, any[], string, any[]>;
  filter: TableFilter<UsersFilterableColumns>;
  setOperatorInvalid: () => void;
};

function applyUserIdFilter({ usersQuery, filter, setOperatorInvalid }: FilterFunctionParams) {
  if (filter.operator === 'equals') {
    return usersQuery.eq(filter.column!, `${filter.value}`);
  } else {
    setOperatorInvalid();
    return usersQuery;
  }
}

function applyCreatedAtFilter({ usersQuery, filter, setOperatorInvalid }: FilterFunctionParams) {
  if (filter.operator === '=') {
    // Cannot use eq because of timestamptz
    // To filter by specific date (e.g. 2024/01/02) use previous date < given date < next date

    const givenDate = new Date(`${filter.value}`);

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
    setOperatorInvalid();
    return usersQuery;
  }
}

function applyNameOrContactNumberFilter({ usersQuery, filter, setOperatorInvalid }: FilterFunctionParams) {
  if (filter.operator === 'contains') {
    return usersQuery.ilike(filter.column!, `%${filter.value}%`);
  } else if (filter.operator === 'equals') {
    return usersQuery.eq(filter.column!, filter.value);
  } else if (filter.operator === 'startsWith') {
    return usersQuery.like(filter.column!, `${filter.value}%`);
  } else if (filter.operator === 'endsWith') {
    return usersQuery.like(filter.column!, `%${filter.value}`);
  } else if (filter.operator === 'isEmpty') {
    return usersQuery.is(filter.column!, null);
  } else if (filter.operator === 'isNotEmpty') {
    return usersQuery.ilike(filter.column!, '%');
  } else {
    setOperatorInvalid();
    return usersQuery;
  }
}

function applyEmailFilter({ usersQuery, filter, setOperatorInvalid }: FilterFunctionParams) {
  if (filter.operator === 'contains') {
    return usersQuery.ilike(filter.column!, `%${filter.value}%`);
  } else if (filter.operator === 'equals') {
    return usersQuery.eq(filter.column!, filter.value);
  } else if (filter.operator === 'startsWith') {
    return usersQuery.ilike(filter.column!, `${filter.value}%`);
  } else if (filter.operator === 'endsWith') {
    return usersQuery.ilike(filter.column!, `%${filter.value}`);
  } else {
    setOperatorInvalid();
    return usersQuery;
  }
}

function applyRoleFilter({ usersQuery, filter, setOperatorInvalid }: FilterFunctionParams) {
  if (filter.operator === 'is') {
    return usersQuery.eq(filter.column!, filter.value);
  } else if (filter.operator === 'not') {
    return usersQuery.neq(filter.column!, filter.value);
  } else {
    setOperatorInvalid();
    return usersQuery;
  }
}

export function applyFilterForUsersTable(
  usersQuery: PostgrestFilterBuilder<Database['public'], any, any[], string, any[]>,
  filter: TableFilter<UsersFilterableColumns>,
  setColumnInvalid: () => void,
  setOperatorInvalid: () => void
) {
  switch (filter.column) {
    case 'userId':
      return applyUserIdFilter({ usersQuery, filter, setOperatorInvalid });
    case 'createdAt':
      return applyCreatedAtFilter({ usersQuery, filter, setOperatorInvalid });
    case 'firstName':
    case 'lastName':
    case 'contactNumber':
      return applyNameOrContactNumberFilter({ usersQuery, filter, setOperatorInvalid });
    case 'email':
      return applyEmailFilter({ usersQuery, filter, setOperatorInvalid });
    case 'role':
      return applyRoleFilter({ usersQuery, filter, setOperatorInvalid });
    default:
      setColumnInvalid();
      return usersQuery;
  }
}
